using CalorieCalculator.Api.DTOs;
using CalorieCalculator.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CalorieCalculator.Api.Controllers;

[ApiController]
[Route("api/metrics")]
[Authorize]
public class MetricsController : ControllerBase
{
    private readonly IMetricsService _metricsService;

    public MetricsController(IMetricsService metricsService)
    {
        _metricsService = metricsService;
    }

    private int GetUserId()
    {
        var userIdClaim = User.FindFirst("userId")?.Value;
        return int.TryParse(userIdClaim, out var userId) ? userId : 0;
    }

    [HttpGet("daily")]
    public async Task<ActionResult<DailyMetricsDto>> GetDailyMetrics([FromQuery] DateTime? date)
    {
        var userId = GetUserId();
        var targetDate = date ?? DateTime.UtcNow;
        var metrics = await _metricsService.GetDailyMetricsAsync(userId, targetDate);
        return Ok(metrics);
    }

    [HttpGet("range")]
    public async Task<ActionResult<RangeMetricsDto>> GetRangeMetrics(
        [FromQuery] DateTime from,
        [FromQuery] DateTime to)
    {
        var userId = GetUserId();

        if (from > to)
        {
            return BadRequest(new { message = "'from' date must be before 'to' date" });
        }

        var metrics = await _metricsService.GetRangeMetricsAsync(userId, from, to);
        return Ok(metrics);
    }
}

