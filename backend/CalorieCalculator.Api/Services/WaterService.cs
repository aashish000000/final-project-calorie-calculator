using CalorieCalculator.Api.Data;
using CalorieCalculator.Api.DTOs;
using CalorieCalculator.Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace CalorieCalculator.Api.Services;

public class WaterService : IWaterService
{
    private readonly AppDbContext _context;

    public WaterService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<WaterSummaryResponse> GetWaterSummaryAsync(int userId, DateTime date)
    {
        var dateOnly = date.Date;

        var user = await _context.Users.FindAsync(userId);
        if (user == null)
        {
            throw new KeyNotFoundException("User not found");
        }

        var entries = await _context.WaterEntries
            .Where(w => w.UserId == userId && w.Date.Date == dateOnly)
            .OrderBy(w => w.CreatedAt)
            .Select(w => new WaterEntryDto
            {
                Id = w.Id,
                Milliliters = w.MillilitersConsumed,
                CreatedAt = w.CreatedAt
            })
            .ToListAsync();

        var totalMilliliters = entries.Sum(e => e.Milliliters);
        var goal = user.WaterGoalMilliliters;
        var percentage = goal > 0 ? (decimal)totalMilliliters / goal * 100 : 0;

        return new WaterSummaryResponse
        {
            Date = dateOnly,
            TotalMilliliters = totalMilliliters,
            GoalMilliliters = goal,
            PercentageOfGoal = Math.Round(percentage, 1),
            Entries = entries
        };
    }

    public async Task<WaterEntryDto> LogWaterAsync(int userId, int milliliters, DateTime? date = null)
    {
        if (milliliters <= 0)
        {
            throw new ArgumentException("Milliliters must be greater than 0");
        }

        var entry = new WaterEntry
        {
            UserId = userId,
            Date = (date ?? DateTime.UtcNow).Date,
            MillilitersConsumed = milliliters,
            CreatedAt = DateTime.UtcNow
        };

        _context.WaterEntries.Add(entry);
        await _context.SaveChangesAsync();

        return new WaterEntryDto
        {
            Id = entry.Id,
            Milliliters = entry.MillilitersConsumed,
            CreatedAt = entry.CreatedAt
        };
    }

    public async Task DeleteWaterEntryAsync(int userId, int entryId)
    {
        var entry = await _context.WaterEntries
            .FirstOrDefaultAsync(w => w.Id == entryId && w.UserId == userId);

        if (entry == null)
        {
            throw new KeyNotFoundException("Water entry not found");
        }

        _context.WaterEntries.Remove(entry);
        await _context.SaveChangesAsync();
    }
}
