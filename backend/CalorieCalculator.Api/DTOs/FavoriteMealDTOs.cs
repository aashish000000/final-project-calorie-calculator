namespace CalorieCalculator.Api.DTOs;

public class CreateFavoriteMealRequest
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public List<FavoriteMealItemRequest> Items { get; set; } = new();
}

public class FavoriteMealItemRequest
{
    public int FoodId { get; set; }
    public int Grams { get; set; }
}

public class FavoriteMealResponse
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; }
    public List<FavoriteMealItemDto> Items { get; set; } = new();
    public decimal TotalCalories { get; set; }
    public decimal TotalProtein { get; set; }
    public decimal TotalCarbs { get; set; }
    public decimal TotalFat { get; set; }
}

public class FavoriteMealItemDto
{
    public int Id { get; set; }
    public int FoodId { get; set; }
    public string FoodName { get; set; } = string.Empty;
    public int Grams { get; set; }
    public decimal Calories { get; set; }
    public decimal Protein { get; set; }
    public decimal Carbs { get; set; }
    public decimal Fat { get; set; }
}
