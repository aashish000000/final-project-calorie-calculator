using CalorieCalculator.Api.DTOs;

namespace CalorieCalculator.Api.Services;

public interface ISuggestionsService
{
    Task<FoodSuggestionsResponse> GetFoodSuggestionsAsync(int userId, DateTime? date = null);
}
