using CalorieCalculator.Api.Data;
using CalorieCalculator.Api.DTOs;
using Microsoft.EntityFrameworkCore;

namespace CalorieCalculator.Api.Services;

public interface IMetricsService
{
    Task<DailyMetricsDto> GetDailyMetricsAsync(int userId, DateTime date);
    Task<RangeMetricsDto> GetRangeMetricsAsync(int userId, DateTime from, DateTime to);
}

public class MetricsService : IMetricsService
{
    private readonly AppDbContext _context;

    public MetricsService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<DailyMetricsDto> GetDailyMetricsAsync(int userId, DateTime date)
    {
        var startOfDay = date.Date;
        var endOfDay = startOfDay.AddDays(1);

        var entries = await _context.EntryItems
            .Include(e => e.Food)
            .Where(e => e.UserId == userId && e.CreatedAt >= startOfDay && e.CreatedAt < endOfDay)
            .OrderByDescending(e => e.CreatedAt)
            .ToListAsync();

        return new DailyMetricsDto
        {
            Date = date.Date,
            TotalCalories = entries.Sum(e => e.Calories),
            TotalProtein = entries.Sum(e => e.Protein),
            TotalCarbs = entries.Sum(e => e.Carbs),
            TotalFat = entries.Sum(e => e.Fat),
            Entries = entries.Select(e => new EntryItemDto
            {
                Id = e.Id,
                UserId = e.UserId,
                FoodId = e.FoodId,
                FoodName = e.Food?.Name ?? "Unknown",
                Grams = e.Grams,
                Calories = e.Calories,
                Protein = e.Protein,
                Carbs = e.Carbs,
                Fat = e.Fat,
                CreatedAt = e.CreatedAt
            }).ToList()
        };
    }

    public async Task<RangeMetricsDto> GetRangeMetricsAsync(int userId, DateTime from, DateTime to)
    {
        var startDate = from.Date;
        var endDate = to.Date.AddDays(1); // Include the entire "to" day

        var entries = await _context.EntryItems
            .Include(e => e.Food)
            .Where(e => e.UserId == userId && e.CreatedAt >= startDate && e.CreatedAt < endDate)
            .ToListAsync();

        // Group by date for daily data
        var dailyData = entries
            .GroupBy(e => e.CreatedAt.Date)
            .Select(g => new DailySummaryDto
            {
                Date = g.Key,
                Calories = g.Sum(e => e.Calories),
                Protein = g.Sum(e => e.Protein),
                Carbs = g.Sum(e => e.Carbs),
                Fat = g.Sum(e => e.Fat)
            })
            .OrderBy(d => d.Date)
            .ToList();

        // Fill in missing dates with zeros
        var allDates = new List<DailySummaryDto>();
        for (var date = startDate; date < endDate; date = date.AddDays(1))
        {
            var existing = dailyData.FirstOrDefault(d => d.Date == date);
            allDates.Add(existing ?? new DailySummaryDto
            {
                Date = date,
                Calories = 0,
                Protein = 0,
                Carbs = 0,
                Fat = 0
            });
        }

        // Top foods by calories
        var topFoods = entries
            .GroupBy(e => new { e.FoodId, e.Food?.Name })
            .Select(g => new TopFoodDto
            {
                FoodId = g.Key.FoodId,
                FoodName = g.Key.Name ?? "Unknown",
                TotalCalories = g.Sum(e => e.Calories),
                EntryCount = g.Count()
            })
            .OrderByDescending(f => f.TotalCalories)
            .Take(10)
            .ToList();

        return new RangeMetricsDto
        {
            FromDate = from.Date,
            ToDate = to.Date,
            TotalCalories = entries.Sum(e => e.Calories),
            TotalProtein = entries.Sum(e => e.Protein),
            TotalCarbs = entries.Sum(e => e.Carbs),
            TotalFat = entries.Sum(e => e.Fat),
            DailyData = allDates,
            TopFoods = topFoods
        };
    }
}

