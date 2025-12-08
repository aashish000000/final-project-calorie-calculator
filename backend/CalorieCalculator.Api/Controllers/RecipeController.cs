using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CalorieCalculator.Api.Services;
using CalorieCalculator.Api.DTOs;

namespace CalorieCalculator.Api.Controllers;

[ApiController]
[Route("api/recipe")]
[Authorize]
public class RecipeController : ControllerBase
{
    private readonly IRecipeAnalyzerService _recipeAnalyzerService;

    public RecipeController(IRecipeAnalyzerService recipeAnalyzerService)
    {
        _recipeAnalyzerService = recipeAnalyzerService;
    }

    [HttpPost("analyze")]
    public async Task<ActionResult<RecipeAnalysisResponse>> AnalyzeRecipe([FromBody] RecipeAnalysisRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.RecipeText))
        {
            return BadRequest(new { message = "Recipe text is required" });
        }

        try
        {
            var result = await _recipeAnalyzerService.AnalyzeRecipeAsync(request.RecipeText, request.Servings);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return StatusCode(500, new { message = ex.Message });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Recipe analysis error: {ex.Message}");
            return StatusCode(500, new { message = "Failed to analyze recipe. Please check the recipe format and try again." });
        }
    }
}
