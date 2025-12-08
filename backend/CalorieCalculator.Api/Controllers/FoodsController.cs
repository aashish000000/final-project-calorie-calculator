using CalorieCalculator.Api.DTOs;
using CalorieCalculator.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CalorieCalculator.Api.Controllers;

[ApiController]
[Route("api/foods")]
[Authorize]
public class FoodsController : ControllerBase
{
    private readonly IFoodService _foodService;

    public FoodsController(IFoodService foodService)
    {
        _foodService = foodService;
    }

    private int GetUserId()
    {
        var userIdClaim = User.FindFirst("userId")?.Value;
        return int.TryParse(userIdClaim, out var userId) ? userId : 0;
    }

    [HttpGet]
    public async Task<ActionResult<List<FoodDto>>> GetFoods()
    {
        var userId = GetUserId();
        var foods = await _foodService.GetFoodsAsync(userId);
        return Ok(foods);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<FoodDto>> GetFood(int id)
    {
        var food = await _foodService.GetFoodByIdAsync(id);
        if (food == null)
        {
            return NotFound();
        }
        return Ok(food);
    }

    [HttpPost]
    public async Task<ActionResult<FoodDto>> CreateFood([FromBody] CreateFoodRequest request)
    {
        var userId = GetUserId();
        var food = await _foodService.CreateFoodAsync(userId, request);
        return CreatedAtAction(nameof(GetFood), new { id = food.Id }, food);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<FoodDto>> UpdateFood(int id, [FromBody] UpdateFoodRequest request)
    {
        var userId = GetUserId();
        var food = await _foodService.UpdateFoodAsync(userId, id, request);

        if (food == null)
        {
            return NotFound();
        }

        return Ok(food);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteFood(int id)
    {
        var userId = GetUserId();
        var success = await _foodService.DeleteFoodAsync(userId, id);

        if (!success)
        {
            return NotFound();
        }

        return NoContent();
    }
}

