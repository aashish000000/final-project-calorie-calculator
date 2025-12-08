using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CalorieCalculator.Api.Services;
using CalorieCalculator.Api.DTOs;

namespace CalorieCalculator.Api.Controllers;

[ApiController]
[Route("api/favorite-meals")]
[Authorize]
public class FavoriteMealsController : ControllerBase
{
    private readonly IFavoriteMealService _favoriteMealService;

    public FavoriteMealsController(IFavoriteMealService favoriteMealService)
    {
        _favoriteMealService = favoriteMealService;
    }

    private int GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.Parse(userIdClaim!);
    }

    [HttpGet]
    public async Task<ActionResult<List<FavoriteMealResponse>>> GetFavoriteMeals()
    {
        try
        {
            var userId = GetUserId();
            var meals = await _favoriteMealService.GetFavoriteMealsAsync(userId);
            return Ok(meals);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error getting favorite meals: {ex.Message}");
            return StatusCode(500, new { message = "Failed to get favorite meals" });
        }
    }

    [HttpPost]
    public async Task<ActionResult<FavoriteMealResponse>> CreateFavoriteMeal([FromBody] CreateFavoriteMealRequest request)
    {
        try
        {
            var userId = GetUserId();
            var meal = await _favoriteMealService.CreateFavoriteMealAsync(userId, request);
            return Ok(meal);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error creating favorite meal: {ex.Message}");
            return StatusCode(500, new { message = "Failed to create favorite meal" });
        }
    }

    [HttpDelete("{mealId}")]
    public async Task<ActionResult> DeleteFavoriteMeal(int mealId)
    {
        try
        {
            var userId = GetUserId();
            await _favoriteMealService.DeleteFavoriteMealAsync(userId, mealId);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error deleting favorite meal: {ex.Message}");
            return StatusCode(500, new { message = "Failed to delete favorite meal" });
        }
    }

    [HttpGet("{mealId}/items")]
    public async Task<ActionResult<List<CreateEntryRequest>>> GetFavoriteMealItems(int mealId)
    {
        try
        {
            var userId = GetUserId();
            var items = await _favoriteMealService.GetFavoriteMealItemsAsync(userId, mealId);
            return Ok(items);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error getting favorite meal items: {ex.Message}");
            return StatusCode(500, new { message = "Failed to get favorite meal items" });
        }
    }
}
