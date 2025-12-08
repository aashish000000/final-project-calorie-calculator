using CalorieCalculator.Api.DTOs;

namespace CalorieCalculator.Api.Services;

public interface IFavoriteMealService
{
    Task<List<FavoriteMealResponse>> GetFavoriteMealsAsync(int userId);
    Task<FavoriteMealResponse> CreateFavoriteMealAsync(int userId, CreateFavoriteMealRequest request);
    Task DeleteFavoriteMealAsync(int userId, int mealId);
    Task<List<CreateEntryRequest>> GetFavoriteMealItemsAsync(int userId, int mealId);
}
