using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CalorieCalculator.Api.Services;
using CalorieCalculator.Api.DTOs;

namespace CalorieCalculator.Api.Controllers;

[ApiController]
[Route("api/water")]
[Authorize]
public class WaterController : ControllerBase
{
    private readonly IWaterService _waterService;

    public WaterController(IWaterService waterService)
    {
        _waterService = waterService;
    }

    private int GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.Parse(userIdClaim!);
    }

    [HttpGet("summary")]
    public async Task<ActionResult<WaterSummaryResponse>> GetWaterSummary([FromQuery] DateTime? date)
    {
        try
        {
            var userId = GetUserId();
            var targetDate = date ?? DateTime.UtcNow;
            var summary = await _waterService.GetWaterSummaryAsync(userId, targetDate);
            return Ok(summary);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpPost("log")]
    public async Task<ActionResult<WaterEntryDto>> LogWater([FromBody] LogWaterRequest request)
    {
        try
        {
            var userId = GetUserId();
            var entry = await _waterService.LogWaterAsync(userId, request.Milliliters, request.Date);
            return Ok(entry);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("{entryId}")]
    public async Task<ActionResult> DeleteWaterEntry(int entryId)
    {
        try
        {
            var userId = GetUserId();
            await _waterService.DeleteWaterEntryAsync(userId, entryId);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }
}
