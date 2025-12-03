using CalorieCalculator.Api.DTOs;
using CalorieCalculator.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CalorieCalculator.Api.Controllers;

[ApiController]
[Route("api/food-entries")]
[Authorize]
public class EntriesController : ControllerBase
{
    private readonly IEntryService _entryService;

    public EntriesController(IEntryService entryService)
    {
        _entryService = entryService;
    }

    private int GetUserId()
    {
        var userIdClaim = User.FindFirst("userId")?.Value;
        return int.TryParse(userIdClaim, out var userId) ? userId : 0;
    }

    [HttpGet]
    public async Task<ActionResult<List<EntryItemDto>>> GetEntries([FromQuery] DateTime? date)
    {
        var userId = GetUserId();
        var entries = await _entryService.GetEntriesAsync(userId, date);
        return Ok(entries);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<EntryItemDto>> GetEntry(int id)
    {
        var userId = GetUserId();
        var entry = await _entryService.GetEntryByIdAsync(userId, id);

        if (entry == null)
        {
            return NotFound();
        }

        return Ok(entry);
    }

    [HttpPost]
    public async Task<ActionResult<EntryItemDto>> CreateEntry([FromBody] CreateEntryRequest request)
    {
        var userId = GetUserId();
        var entry = await _entryService.CreateEntryAsync(userId, request);

        if (entry == null)
        {
            return BadRequest(new { message = "Food not found" });
        }

        return CreatedAtAction(nameof(GetEntry), new { id = entry.Id }, entry);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<EntryItemDto>> UpdateEntry(int id, [FromBody] UpdateEntryRequest request)
    {
        var userId = GetUserId();
        var entry = await _entryService.UpdateEntryAsync(userId, id, request);

        if (entry == null)
        {
            return NotFound();
        }

        return Ok(entry);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteEntry(int id)
    {
        var userId = GetUserId();
        var success = await _entryService.DeleteEntryAsync(userId, id);

        if (!success)
        {
            return NotFound();
        }

        return NoContent();
    }
}

