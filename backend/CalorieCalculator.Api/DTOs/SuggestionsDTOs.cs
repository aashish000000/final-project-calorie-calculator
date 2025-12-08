namespace CalorieCalculator.Api.DTOs;

public class FoodSuggestionRequest
{
    public DateTime? Date { get; set; }
}

public class FoodSuggestionsResponse
{
    public RemainingNutrients Remaining { get; set; } = new();
    public List<SuggestedFood> Suggestions { get; set; } = new();
    public string Message { get; set; } = string.Empty;
}

public class RemainingNutrients
{
    public int Calories { get; set; }
    public decimal Protein { get; set; }
    public decimal Carbs { get; set; }
    public decimal Fat { get; set; }
}

public class SuggestedFood
{
    public string Name { get; set; } = string.Empty;
    public string Reason { get; set; } = string.Empty;
    public int EstimatedGrams { get; set; }
    public decimal Calories { get; set; }
    public decimal Protein { get; set; }
    public decimal Carbs { get; set; }
    public decimal Fat { get; set; }
}
