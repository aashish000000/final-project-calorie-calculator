using CalorieCalculator.Api.DTOs;

namespace CalorieCalculator.Api.Services;

public interface IImageRecognitionService
{
    Task<ImageRecognitionResponse> AnalyzeFoodImageAsync(Stream imageStream);
}
