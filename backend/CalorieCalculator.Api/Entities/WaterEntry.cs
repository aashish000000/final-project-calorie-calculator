namespace CalorieCalculator.Api.Entities;

public class WaterEntry
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public DateTime Date { get; set; }
    public int MillilitersConsumed { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation
    public User User { get; set; } = null!;
}
