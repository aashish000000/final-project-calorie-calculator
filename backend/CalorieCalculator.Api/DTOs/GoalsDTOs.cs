using System.ComponentModel.DataAnnotations;

namespace CalorieCalculator.Api.DTOs;

public class UserGoalsDto
{
    public int CalorieGoal { get; set; }
    public int ProteinGoal { get; set; }
    public int CarbsGoal { get; set; }
    public int FatGoal { get; set; }
}

public class UpdateGoalsRequest
{
    [Range(500, 10000, ErrorMessage = "Calorie goal must be between 500 and 10000")]
    public int CalorieGoal { get; set; }

    [Range(10, 500, ErrorMessage = "Protein goal must be between 10 and 500g")]
    public int ProteinGoal { get; set; }

    [Range(20, 800, ErrorMessage = "Carbs goal must be between 20 and 800g")]
    public int CarbsGoal { get; set; }

    [Range(10, 300, ErrorMessage = "Fat goal must be between 10 and 300g")]
    public int FatGoal { get; set; }
}

