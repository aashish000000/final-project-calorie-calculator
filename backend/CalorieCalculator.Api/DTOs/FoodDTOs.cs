using System.ComponentModel.DataAnnotations;

namespace CalorieCalculator.Api.DTOs;

public class FoodDto
{
    public int Id { get; set; }
    public int? UserId { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal CaloriesPer100g { get; set; }
    public decimal ProteinPer100g { get; set; }
    public decimal CarbsPer100g { get; set; }
    public decimal FatPer100g { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateFoodRequest
{
    [Required]
    [MaxLength(255)]
    public string Name { get; set; } = string.Empty;

    [Range(0, 10000)]
    public decimal CaloriesPer100g { get; set; }

    [Range(0, 1000)]
    public decimal ProteinPer100g { get; set; }

    [Range(0, 1000)]
    public decimal CarbsPer100g { get; set; }

    [Range(0, 1000)]
    public decimal FatPer100g { get; set; }
}

public class UpdateFoodRequest
{
    [Required]
    [MaxLength(255)]
    public string Name { get; set; } = string.Empty;

    [Range(0, 10000)]
    public decimal CaloriesPer100g { get; set; }

    [Range(0, 1000)]
    public decimal ProteinPer100g { get; set; }

    [Range(0, 1000)]
    public decimal CarbsPer100g { get; set; }

    [Range(0, 1000)]
    public decimal FatPer100g { get; set; }
}

