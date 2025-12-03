namespace CalorieCalculator.Api.DTOs;

public class DailyMetricsDto
{
    public DateTime Date { get; set; }
    public decimal TotalCalories { get; set; }
    public decimal TotalProtein { get; set; }
    public decimal TotalCarbs { get; set; }
    public decimal TotalFat { get; set; }
    public List<EntryItemDto> Entries { get; set; } = new();
}

public class RangeMetricsDto
{
    public DateTime FromDate { get; set; }
    public DateTime ToDate { get; set; }
    public decimal TotalCalories { get; set; }
    public decimal TotalProtein { get; set; }
    public decimal TotalCarbs { get; set; }
    public decimal TotalFat { get; set; }
    public List<DailySummaryDto> DailyData { get; set; } = new();
    public List<TopFoodDto> TopFoods { get; set; } = new();
}

public class DailySummaryDto
{
    public DateTime Date { get; set; }
    public decimal Calories { get; set; }
    public decimal Protein { get; set; }
    public decimal Carbs { get; set; }
    public decimal Fat { get; set; }
}

public class TopFoodDto
{
    public int FoodId { get; set; }
    public string FoodName { get; set; } = string.Empty;
    public decimal TotalCalories { get; set; }
    public int EntryCount { get; set; }
}

