namespace CalorieCalculator.Api.DTOs;

public class ImageRecognitionResponse
{
    public List<RecognizedFood> Foods { get; set; } = new();
    public string? RawAnalysis { get; set; }
}

public class RecognizedFood
{
    public string Name { get; set; } = string.Empty;
    public int EstimatedGrams { get; set; }
    public decimal EstimatedCalories { get; set; }
    public decimal EstimatedProtein { get; set; }
    public decimal EstimatedCarbs { get; set; }
    public decimal EstimatedFat { get; set; }
    public string? Notes { get; set; }
}
