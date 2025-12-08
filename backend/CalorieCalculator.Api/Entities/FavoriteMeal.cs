namespace CalorieCalculator.Api.Entities;

public class FavoriteMeal
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation
    public User User { get; set; } = null!;
    public ICollection<FavoriteMealItem> Items { get; set; } = new List<FavoriteMealItem>();
}

public class FavoriteMealItem
{
    public int Id { get; set; }
    public int FavoriteMealId { get; set; }
    public int FoodId { get; set; }
    public int Grams { get; set; }
    
    // Navigation
    public FavoriteMeal FavoriteMeal { get; set; } = null!;
    public Food Food { get; set; } = null!;
}
