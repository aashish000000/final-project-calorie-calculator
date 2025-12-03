using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CalorieCalculator.Api.Entities;

public class Food
{
    public int Id { get; set; }

    public int? UserId { get; set; } // Null = global food, otherwise user-specific

    [Required]
    [MaxLength(255)]
    public string Name { get; set; } = string.Empty;

    [Column(TypeName = "decimal(10,2)")]
    public decimal CaloriesPer100g { get; set; }

    [Column(TypeName = "decimal(10,2)")]
    public decimal ProteinPer100g { get; set; }

    [Column(TypeName = "decimal(10,2)")]
    public decimal CarbsPer100g { get; set; }

    [Column(TypeName = "decimal(10,2)")]
    public decimal FatPer100g { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public User? User { get; set; }
    public ICollection<EntryItem> EntryItems { get; set; } = new List<EntryItem>();
}

