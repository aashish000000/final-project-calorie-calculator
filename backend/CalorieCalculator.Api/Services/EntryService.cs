using CalorieCalculator.Api.Data;
using CalorieCalculator.Api.DTOs;
using CalorieCalculator.Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace CalorieCalculator.Api.Services;

public interface IEntryService
{
    Task<List<EntryItemDto>> GetEntriesAsync(int userId, DateTime? date);
    Task<EntryItemDto?> GetEntryByIdAsync(int userId, int entryId);
    Task<EntryItemDto?> CreateEntryAsync(int userId, CreateEntryRequest request);
    Task<EntryItemDto?> UpdateEntryAsync(int userId, int entryId, UpdateEntryRequest request);
    Task<bool> DeleteEntryAsync(int userId, int entryId);
}

public class EntryService : IEntryService
{
    private readonly AppDbContext _context;

    public EntryService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<EntryItemDto>> GetEntriesAsync(int userId, DateTime? date)
    {
        var query = _context.EntryItems
            .Include(e => e.Food)
            .Where(e => e.UserId == userId);

        if (date.HasValue)
        {
            var startOfDay = date.Value.Date;
            var endOfDay = startOfDay.AddDays(1);
            query = query.Where(e => e.CreatedAt >= startOfDay && e.CreatedAt < endOfDay);
        }

        var entries = await query
            .OrderByDescending(e => e.CreatedAt)
            .ToListAsync();

        return entries.Select(MapToDto).ToList();
    }

    public async Task<EntryItemDto?> GetEntryByIdAsync(int userId, int entryId)
    {
        var entry = await _context.EntryItems
            .Include(e => e.Food)
            .FirstOrDefaultAsync(e => e.Id == entryId && e.UserId == userId);

        return entry == null ? null : MapToDto(entry);
    }

    public async Task<EntryItemDto?> CreateEntryAsync(int userId, CreateEntryRequest request)
    {
        var food = await _context.Foods.FindAsync(request.FoodId);
        if (food == null)
        {
            return null;
        }

        // Calculate nutrition based on grams
        var multiplier = request.Grams / 100m;
        var entry = new EntryItem
        {
            UserId = userId,
            FoodId = request.FoodId,
            Grams = request.Grams,
            Calories = Math.Round(food.CaloriesPer100g * multiplier, 2),
            Protein = Math.Round(food.ProteinPer100g * multiplier, 2),
            Carbs = Math.Round(food.CarbsPer100g * multiplier, 2),
            Fat = Math.Round(food.FatPer100g * multiplier, 2),
            CreatedAt = request.Date?.ToUniversalTime() ?? DateTime.UtcNow
        };

        _context.EntryItems.Add(entry);
        await _context.SaveChangesAsync();

        // Reload with Food included
        await _context.Entry(entry).Reference(e => e.Food).LoadAsync();

        return MapToDto(entry);
    }

    public async Task<EntryItemDto?> UpdateEntryAsync(int userId, int entryId, UpdateEntryRequest request)
    {
        var entry = await _context.EntryItems
            .Include(e => e.Food)
            .FirstOrDefaultAsync(e => e.Id == entryId && e.UserId == userId);

        if (entry == null)
        {
            return null;
        }

        var food = await _context.Foods.FindAsync(request.FoodId);
        if (food == null)
        {
            return null;
        }

        // Recalculate nutrition
        var multiplier = request.Grams / 100m;
        entry.FoodId = request.FoodId;
        entry.Grams = request.Grams;
        entry.Calories = Math.Round(food.CaloriesPer100g * multiplier, 2);
        entry.Protein = Math.Round(food.ProteinPer100g * multiplier, 2);
        entry.Carbs = Math.Round(food.CarbsPer100g * multiplier, 2);
        entry.Fat = Math.Round(food.FatPer100g * multiplier, 2);

        await _context.SaveChangesAsync();

        // Reload with new Food
        await _context.Entry(entry).Reference(e => e.Food).LoadAsync();

        return MapToDto(entry);
    }

    public async Task<bool> DeleteEntryAsync(int userId, int entryId)
    {
        var entry = await _context.EntryItems
            .FirstOrDefaultAsync(e => e.Id == entryId && e.UserId == userId);

        if (entry == null)
        {
            return false;
        }

        _context.EntryItems.Remove(entry);
        await _context.SaveChangesAsync();

        return true;
    }

    private static EntryItemDto MapToDto(EntryItem entry) => new()
    {
        Id = entry.Id,
        UserId = entry.UserId,
        FoodId = entry.FoodId,
        FoodName = entry.Food?.Name ?? "Unknown",
        Grams = entry.Grams,
        Calories = entry.Calories,
        Protein = entry.Protein,
        Carbs = entry.Carbs,
        Fat = entry.Fat,
        CreatedAt = entry.CreatedAt
    };
}

