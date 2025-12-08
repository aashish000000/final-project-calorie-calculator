using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CalorieCalculator.Api.Services;
using CalorieCalculator.Api.DTOs;

namespace CalorieCalculator.Api.Controllers;

[ApiController]
[Route("api/suggestions")]
[Authorize]
public class SuggestionsController : ControllerBase
{
    private readonly ISuggestionsService _suggestionsService;

    public SuggestionsController(ISuggestionsService suggestionsService)
    {
        _suggestionsService = suggestionsService;
    }

    private int GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.Parse(userIdClaim!);
    }

    [HttpGet]
    public async Task<ActionResult<FoodSuggestionsResponse>> GetSuggestions([FromQuery] DateTime? date)
    {
        try
        {
            var userId = GetUserId();
            var suggestions = await _suggestionsService.GetFoodSuggestionsAsync(userId, date);
            return Ok(suggestions);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error getting suggestions: {ex.Message}");
            return StatusCode(500, new { message = "Failed to get suggestions" });
        }
    }
}
