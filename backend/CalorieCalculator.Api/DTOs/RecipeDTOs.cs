namespace CalorieCalculator.Api.DTOs;

public class RecipeAnalysisRequest
{
    public string RecipeText { get; set; } = string.Empty;
    public int? Servings { get; set; }
}

public class RecipeAnalysisResponse
{
    public string RecipeName { get; set; } = string.Empty;
    public List<RecipeIngredient> Ingredients { get; set; } = new();
    public RecipeNutrition TotalNutrition { get; set; } = new();
    public RecipeNutrition PerServingNutrition { get; set; } = new();
    public int Servings { get; set; }
    public string? Instructions { get; set; }
    public int PrepTimeMinutes { get; set; }
    public int CookTimeMinutes { get; set; }
}

public class RecipeIngredient
{
    public string Name { get; set; } = string.Empty;
    public string Quantity { get; set; } = string.Empty;
    public string Unit { get; set; } = string.Empty;
    public decimal Calories { get; set; }
    public decimal Protein { get; set; }
    public decimal Carbs { get; set; }
    public decimal Fat { get; set; }
}

public class RecipeNutrition
{
    public decimal Calories { get; set; }
    public decimal Protein { get; set; }
    public decimal Carbs { get; set; }
    public decimal Fat { get; set; }
}
