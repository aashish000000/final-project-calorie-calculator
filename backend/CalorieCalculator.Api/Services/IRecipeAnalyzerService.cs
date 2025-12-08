using CalorieCalculator.Api.DTOs;

namespace CalorieCalculator.Api.Services;

public interface IRecipeAnalyzerService
{
    Task<RecipeAnalysisResponse> AnalyzeRecipeAsync(string recipeText, int? servings = null);
}
