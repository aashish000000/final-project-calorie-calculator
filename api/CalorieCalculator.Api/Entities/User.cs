using System.ComponentModel.DataAnnotations;

namespace CalorieCalculator.Api.Entities;

public class User
{
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string FirstName { get; set; } = string.Empty;

    [MaxLength(100)]
    public string? MiddleName { get; set; }

    [Required]
    [MaxLength(100)]
    public string LastName { get; set; } = string.Empty;

    [Required]
    [MaxLength(255)]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string PasswordHash { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Daily Goals
    public int CalorieGoal { get; set; } = 2000;
    public int ProteinGoal { get; set; } = 150;
    public int CarbsGoal { get; set; } = 250;
    public int FatGoal { get; set; } = 65;

    // Navigation properties
    public ICollection<Food> Foods { get; set; } = new List<Food>();
    public ICollection<EntryItem> EntryItems { get; set; } = new List<EntryItem>();

    // Computed property for full name
    public string FullName => string.IsNullOrEmpty(MiddleName) 
        ? $"{FirstName} {LastName}" 
        : $"{FirstName} {MiddleName} {LastName}";
}

