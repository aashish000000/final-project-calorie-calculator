using System.ComponentModel.DataAnnotations;

namespace CalorieCalculator.Api.DTOs;

public class EntryItemDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int FoodId { get; set; }
    public string FoodName { get; set; } = string.Empty;
    public decimal Grams { get; set; }
    public decimal Calories { get; set; }
    public decimal Protein { get; set; }
    public decimal Carbs { get; set; }
    public decimal Fat { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateEntryRequest
{
    [Required]
    public int FoodId { get; set; }

    [Required]
    [Range(1, 10000)]
    public decimal Grams { get; set; }

    public DateTime? Date { get; set; } // Optional, defaults to now
}

public class UpdateEntryRequest
{
    [Required]
    public int FoodId { get; set; }

    [Required]
    [Range(1, 10000)]
    public decimal Grams { get; set; }
}

