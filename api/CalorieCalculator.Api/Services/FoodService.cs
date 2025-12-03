using CalorieCalculator.Api.Data;
using CalorieCalculator.Api.DTOs;
using CalorieCalculator.Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace CalorieCalculator.Api.Services;

public interface IFoodService
{
    Task<List<FoodDto>> GetFoodsAsync(int? userId);
    Task<FoodDto?> GetFoodByIdAsync(int id);
    Task<FoodDto> CreateFoodAsync(int userId, CreateFoodRequest request);
    Task<FoodDto?> UpdateFoodAsync(int userId, int foodId, UpdateFoodRequest request);
    Task<bool> DeleteFoodAsync(int userId, int foodId);
}

public class FoodService : IFoodService
{
    private readonly AppDbContext _context;

    public FoodService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<FoodDto>> GetFoodsAsync(int? userId)
    {
        var query = _context.Foods.AsQueryable();

        // Return global foods (UserId == null) and user's own foods
        if (userId.HasValue)
        {
            query = query.Where(f => f.UserId == null || f.UserId == userId);
        }
        else
        {
            query = query.Where(f => f.UserId == null);
        }

        var foods = await query
            .OrderBy(f => f.Name)
            .ToListAsync();

        return foods.Select(MapToDto).ToList();
    }

    public async Task<FoodDto?> GetFoodByIdAsync(int id)
    {
        var food = await _context.Foods.FindAsync(id);
        return food == null ? null : MapToDto(food);
    }

    public async Task<FoodDto> CreateFoodAsync(int userId, CreateFoodRequest request)
    {
        var food = new Food
        {
            UserId = userId,
            Name = request.Name,
            CaloriesPer100g = request.CaloriesPer100g,
            ProteinPer100g = request.ProteinPer100g,
            CarbsPer100g = request.CarbsPer100g,
            FatPer100g = request.FatPer100g,
            CreatedAt = DateTime.UtcNow
        };

        _context.Foods.Add(food);
        await _context.SaveChangesAsync();

        return MapToDto(food);
    }

    public async Task<FoodDto?> UpdateFoodAsync(int userId, int foodId, UpdateFoodRequest request)
    {
        var food = await _context.Foods.FindAsync(foodId);

        if (food == null || (food.UserId != null && food.UserId != userId))
        {
            return null; // Can't edit global foods or other users' foods
        }

        food.Name = request.Name;
        food.CaloriesPer100g = request.CaloriesPer100g;
        food.ProteinPer100g = request.ProteinPer100g;
        food.CarbsPer100g = request.CarbsPer100g;
        food.FatPer100g = request.FatPer100g;

        await _context.SaveChangesAsync();

        return MapToDto(food);
    }

    public async Task<bool> DeleteFoodAsync(int userId, int foodId)
    {
        var food = await _context.Foods.FindAsync(foodId);

        if (food == null || (food.UserId != null && food.UserId != userId))
        {
            return false; // Can't delete global foods or other users' foods
        }

        _context.Foods.Remove(food);
        await _context.SaveChangesAsync();

        return true;
    }

    private static FoodDto MapToDto(Food food) => new()
    {
        Id = food.Id,
        UserId = food.UserId,
        Name = food.Name,
        CaloriesPer100g = food.CaloriesPer100g,
        ProteinPer100g = food.ProteinPer100g,
        CarbsPer100g = food.CarbsPer100g,
        FatPer100g = food.FatPer100g,
        CreatedAt = food.CreatedAt
    };
}

