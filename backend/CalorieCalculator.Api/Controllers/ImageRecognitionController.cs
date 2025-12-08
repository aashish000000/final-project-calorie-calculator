using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CalorieCalculator.Api.Services;
using CalorieCalculator.Api.DTOs;

namespace CalorieCalculator.Api.Controllers;

[ApiController]
[Route("api/image-recognition")]
[Authorize]
public class ImageRecognitionController : ControllerBase
{
    private readonly IImageRecognitionService _imageRecognitionService;

    public ImageRecognitionController(IImageRecognitionService imageRecognitionService)
    {
        _imageRecognitionService = imageRecognitionService;
    }

    [HttpPost("analyze")]
    public async Task<ActionResult<ImageRecognitionResponse>> AnalyzeFood(IFormFile image)
    {
        if (image == null || image.Length == 0)
        {
            return BadRequest(new { message = "No image provided" });
        }

        // Validate image type
        var allowedTypes = new[] { "image/jpeg", "image/jpg", "image/png", "image/webp" };
        if (!allowedTypes.Contains(image.ContentType.ToLower()))
        {
            return BadRequest(new { message = "Only JPEG, PNG, and WebP images are supported" });
        }

        // Validate file size (max 20MB)
        if (image.Length > 20 * 1024 * 1024)
        {
            return BadRequest(new { message = "Image size must be less than 20MB" });
        }

        try
        {
            using var stream = image.OpenReadStream();
            var result = await _imageRecognitionService.AnalyzeFoodImageAsync(stream);
            return Ok(result);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Image recognition error: {ex.Message}");
            return StatusCode(500, new { message = "Failed to analyze image. Please try again." });
        }
    }
}
