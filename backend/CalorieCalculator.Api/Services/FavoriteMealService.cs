using CalorieCalculator.Api.Data;
using CalorieCalculator.Api.DTOs;
using CalorieCalculator.Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace CalorieCalculator.Api.Services;

public class FavoriteMealService : IFavoriteMealService
{
    private readonly AppDbContext _context;

    public FavoriteMealService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<FavoriteMealResponse>> GetFavoriteMealsAsync(int userId)
    {
        var favoriteMeals = await _context.FavoriteMeals
            .Include(fm => fm.Items)
            .ThenInclude(fmi => fmi.Food)
            .Where(fm => fm.UserId == userId)
            .OrderByDescending(fm => fm.CreatedAt)
            .ToListAsync();

        return favoriteMeals.Select(fm => MapToDto(fm)).ToList();
    }

    public async Task<FavoriteMealResponse> CreateFavoriteMealAsync(int userId, CreateFavoriteMealRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
        {
            throw new ArgumentException("Meal name is required");
        }

        if (request.Items == null || request.Items.Count == 0)
        {
            throw new ArgumentException("At least one food item is required");
        }

        var favoriteMeal = new FavoriteMeal
        {
            UserId = userId,
            Name = request.Name.Trim(),
            Description = request.Description?.Trim(),
            CreatedAt = DateTime.UtcNow
        };

        _context.FavoriteMeals.Add(favoriteMeal);
        await _context.SaveChangesAsync();

        foreach (var item in request.Items)
        {
            var food = await _context.Foods.FindAsync(item.FoodId);
            if (food == null) continue;

            var mealItem = new FavoriteMealItem
            {
                FavoriteMealId = favoriteMeal.Id,
                FoodId = item.FoodId,
                Grams = item.Grams
            };

            _context.FavoriteMealItems.Add(mealItem);
        }

        await _context.SaveChangesAsync();

        // Reload with includes
        var created = await _context.FavoriteMeals
            .Include(fm => fm.Items)
            .ThenInclude(fmi => fmi.Food)
            .FirstAsync(fm => fm.Id == favoriteMeal.Id);

        return MapToDto(created);
    }

    public async Task DeleteFavoriteMealAsync(int userId, int mealId)
    {
        var favoriteMeal = await _context.FavoriteMeals
            .FirstOrDefaultAsync(fm => fm.Id == mealId && fm.UserId == userId);

        if (favoriteMeal == null)
        {
            throw new KeyNotFoundException("Favorite meal not found");
        }

        _context.FavoriteMeals.Remove(favoriteMeal);
        await _context.SaveChangesAsync();
    }

    public async Task<List<CreateEntryRequest>> GetFavoriteMealItemsAsync(int userId, int mealId)
    {
        var favoriteMeal = await _context.FavoriteMeals
            .Include(fm => fm.Items)
            .FirstOrDefaultAsync(fm => fm.Id == mealId && fm.UserId == userId);

        if (favoriteMeal == null)
        {
            throw new KeyNotFoundException("Favorite meal not found");
        }

        return favoriteMeal.Items.Select(item => new CreateEntryRequest
        {
            FoodId = item.FoodId,
            Grams = item.Grams
        }).ToList();
    }

    private FavoriteMealResponse MapToDto(FavoriteMeal favoriteMeal)
    {
        var items = favoriteMeal.Items.Select(item =>
        {
            var calories = item.Food.CaloriesPer100g * item.Grams / 100m;
            var protein = item.Food.ProteinPer100g * item.Grams / 100m;
            var carbs = item.Food.CarbsPer100g * item.Grams / 100m;
            var fat = item.Food.FatPer100g * item.Grams / 100m;

            return new FavoriteMealItemDto
            {
                Id = item.Id,
                FoodId = item.FoodId,
                FoodName = item.Food.Name,
                Grams = item.Grams,
                Calories = calories,
                Protein = protein,
                Carbs = carbs,
                Fat = fat
            };
        }).ToList();

        return new FavoriteMealResponse
        {
            Id = favoriteMeal.Id,
            Name = favoriteMeal.Name,
            Description = favoriteMeal.Description,
            CreatedAt = favoriteMeal.CreatedAt,
            Items = items,
            TotalCalories = items.Sum(i => i.Calories),
            TotalProtein = items.Sum(i => i.Protein),
            TotalCarbs = items.Sum(i => i.Carbs),
            TotalFat = items.Sum(i => i.Fat)
        };
    }
}
