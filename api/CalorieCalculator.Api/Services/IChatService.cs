using CalorieCalculator.Api.DTOs;

namespace CalorieCalculator.Api.Services;

public interface IChatService
{
    Task<ChatResponse> GetResponseAsync(int userId, ChatRequest request);
}

