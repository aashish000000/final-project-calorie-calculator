using CalorieCalculator.Api.DTOs;

namespace CalorieCalculator.Api.Services;

public interface IWaterService
{
    Task<WaterSummaryResponse> GetWaterSummaryAsync(int userId, DateTime date);
    Task<WaterEntryDto> LogWaterAsync(int userId, int milliliters, DateTime? date = null);
    Task DeleteWaterEntryAsync(int userId, int entryId);
}
