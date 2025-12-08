namespace CalorieCalculator.Api.DTOs;

public class LogWaterRequest
{
    public int Milliliters { get; set; }
    public DateTime? Date { get; set; }
}

public class WaterSummaryResponse
{
    public DateTime Date { get; set; }
    public int TotalMilliliters { get; set; }
    public int GoalMilliliters { get; set; }
    public decimal PercentageOfGoal { get; set; }
    public List<WaterEntryDto> Entries { get; set; } = new();
}

public class WaterEntryDto
{
    public int Id { get; set; }
    public int Milliliters { get; set; }
    public DateTime CreatedAt { get; set; }
}
