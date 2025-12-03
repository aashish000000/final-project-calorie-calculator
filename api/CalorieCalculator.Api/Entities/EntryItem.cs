using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CalorieCalculator.Api.Entities;

public class EntryItem
{
    public int Id { get; set; }

    [Required]
    public int UserId { get; set; }

    [Required]
    public int FoodId { get; set; }

    [Column(TypeName = "decimal(10,2)")]
    public decimal Grams { get; set; }

    [Column(TypeName = "decimal(10,2)")]
    public decimal Calories { get; set; }

    [Column(TypeName = "decimal(10,2)")]
    public decimal Protein { get; set; }

    [Column(TypeName = "decimal(10,2)")]
    public decimal Carbs { get; set; }

    [Column(TypeName = "decimal(10,2)")]
    public decimal Fat { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public User User { get; set; } = null!;
    public Food Food { get; set; } = null!;
}

