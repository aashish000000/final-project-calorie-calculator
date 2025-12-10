using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using CalorieCalculator.Api.Data;
using CalorieCalculator.Api.DTOs;
using CalorieCalculator.Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace CalorieCalculator.Api.Services;

public class ChatService : IChatService
{
    private readonly string? _apiKey;
    private readonly bool _isConfigured;
    private readonly AppDbContext _context;
    private readonly IMetricsService _metricsService;
    private readonly HttpClient _httpClient;

    public ChatService(OpenAiSettings openAiSettings, AppDbContext context, IMetricsService metricsService, IHttpClientFactory httpClientFactory)
    {
        _context = context;
        _metricsService = metricsService;
        _httpClient = httpClientFactory.CreateClient();

        // Read from configuration (OpenAI:ApiKey)
        _apiKey = openAiSettings.ApiKey;

        // If the key is absent, disable the chat client
        _isConfigured = !string.IsNullOrWhiteSpace(_apiKey);
    }

    public async Task<ChatResponse> GetResponseAsync(int userId, ChatRequest request)
    {
        // Inform users if no API key is configured
        if (!_isConfigured)
        {
            return new ChatResponse
            {
                Reply = "Chat functionality is disabled. Please configure a valid OpenAI API key."
            };
        }

        // Validate the incoming message
        if (string.IsNullOrWhiteSpace(request.Message))
        {
            return new ChatResponse { Reply = "Please ask a question about food or nutrition so I can help." };
        }

        // Fetch user context data
        var user = await _context.Users.FindAsync(userId);
        if (user == null)
        {
            return new ChatResponse { Reply = "User not found. Please try again." };
        }

        // Get today's metrics
        var today = DateTime.UtcNow.Date;
        var dailyMetrics = await _metricsService.GetDailyMetricsAsync(userId, today);

        // Get recent food entries (last 5)
        var recentEntries = await _context.EntryItems
            .Include(e => e.Food)
            .Where(e => e.UserId == userId)
            .OrderByDescending(e => e.CreatedAt)
            .Take(5)
            .ToListAsync();

        // Get user's most used foods (top 10) - fetch first, then aggregate in memory (SQLite doesn't support Sum on decimal)
        var allUserEntries = await _context.EntryItems
            .Include(e => e.Food)
            .Where(e => e.UserId == userId)
            .ToListAsync();

        var topFoods = allUserEntries
            .GroupBy(e => new { e.FoodId, FoodName = e.Food?.Name ?? "Unknown" })
            .Select(g => new
            {
                Name = g.Key.FoodName,
                Count = g.Count(),
                TotalCalories = g.Sum(e => e.Calories)
            })
            .OrderByDescending(f => f.Count)
            .Take(10)
            .ToList();

        // Calculate remaining macros
        var remainingCalories = Math.Max(0, user.CalorieGoal - (int)dailyMetrics.TotalCalories);
        var remainingProtein = Math.Max(0, user.ProteinGoal - (int)dailyMetrics.TotalProtein);
        var remainingCarbs = Math.Max(0, user.CarbsGoal - (int)dailyMetrics.TotalCarbs);
        var remainingFat = Math.Max(0, user.FatGoal - (int)dailyMetrics.TotalFat);

        // Build comprehensive system prompt with user context
        var systemPrompt = BuildSystemPrompt(user, dailyMetrics, recentEntries, topFoods, remainingCalories, remainingProtein, remainingCarbs, remainingFat);

        // Build messages array for OpenAI API
        var messages = new List<object>
        {
            new { role = "system", content = systemPrompt }
        };

        // Convert conversation history from frontend format to OpenAI format
        if (request.History != null && request.History.Any())
        {
            foreach (var historyItem in request.History)
            {
                if (historyItem.Sender == "user")
                {
                    messages.Add(new { role = "user", content = historyItem.Text });
                }
                else if (historyItem.Sender == "assistant")
                {
                    messages.Add(new { role = "assistant", content = historyItem.Text });
                }
            }
        }

        // Add the current user message
        messages.Add(new { role = "user", content = request.Message });

        try
        {
            var requestBody = new
            {
                model = "gpt-4o-mini",
                messages = messages,
                max_tokens = 1000,
                temperature = 0.7
            };

            var responseBody = await CallOpenAIAsync(requestBody);
            
            if (string.IsNullOrEmpty(responseBody))
            {
                return new ChatResponse { Reply = "Failed to get response from AI. Please try again." };
            }

            // Check if it's an error response
            if (responseBody.Contains("\"error\""))
            {
                Console.WriteLine($"OpenAI API error: {responseBody}");
                return new ChatResponse { Reply = "OpenAI API error. Please check your API key." };
            }

            // Parse the response
            using var doc = JsonDocument.Parse(responseBody);
            var reply = doc.RootElement
                .GetProperty("choices")[0]
                .GetProperty("message")
                .GetProperty("content")
                .GetString()?.Trim();

            return new ChatResponse
            {
                Reply = string.IsNullOrWhiteSpace(reply)
                    ? "I couldn't think of a good answer. Try asking in another way!"
                    : reply
            };
        }
        catch (Exception ex)
        {
            // Log the full exception for debugging
            Console.WriteLine($"Chat error: {ex.GetType().Name}: {ex.Message}");
            Console.WriteLine($"Stack trace: {ex.StackTrace}");
            if (ex.InnerException != null)
            {
                Console.WriteLine($"Inner exception: {ex.InnerException.Message}");
            }
            return new ChatResponse { Reply = $"Sorry, something went wrong: {ex.Message}" };
        }
    }

    private async Task<string> CallOpenAIAsync(object requestBody)
    {
        var jsonContent = JsonSerializer.Serialize(requestBody);
        var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

        var request = new HttpRequestMessage(HttpMethod.Post, "https://api.openai.com/v1/chat/completions");
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _apiKey);
        request.Content = content;

        var response = await _httpClient.SendAsync(request);
        return await response.Content.ReadAsStringAsync();
    }

    private string BuildSystemPrompt(
        User user,
        DailyMetricsDto dailyMetrics,
        List<EntryItem> recentEntries,
        IEnumerable<dynamic> topFoods,
        int remainingCalories,
        int remainingProtein,
        int remainingCarbs,
        int remainingFat)
    {
        var prompt = @"You are an advanced, knowledgeable nutrition assistant inside a calorie tracking app. You provide comprehensive, detailed, and personalized nutrition advice.

CAPABILITIES:
- Provide detailed information about calories, macronutrients (protein, carbs, fats), and micronutrients
- Offer health tips and dietary recommendations
- Answer questions about protein, carbohydrates, fats, vitamins, minerals, and their roles
- Suggest meal planning ideas and recipes
- Recommend food combinations for optimal nutrition
- Give personalized advice based on the user's goals and current intake
- Explain nutrition science in an accessible way
- Help with weight management, muscle building, and general health

RESPONSE STYLE:
- Provide detailed, comprehensive answers (not just 2-4 sentences)
- Use specific examples and concrete food recommendations
- Be friendly, helpful, and encouraging
- Break down complex topics into understandable explanations
- Include practical tips and actionable advice

IMPORTANT DISCLAIMERS:
- If asked for medical advice, always recommend consulting with a healthcare professional
- Do not diagnose medical conditions
- Focus on general nutrition and wellness guidance

USER CONTEXT:
";

        // Add user's goals
        prompt += $"\nDaily Goals:\n";
        prompt += $"- Calories: {user.CalorieGoal} kcal\n";
        prompt += $"- Protein: {user.ProteinGoal} g\n";
        prompt += $"- Carbs: {user.CarbsGoal} g\n";
        prompt += $"- Fat: {user.FatGoal} g\n";

        // Add today's intake
        prompt += $"\nToday's Intake (so far):\n";
        var caloriePct = user.CalorieGoal > 0 ? (dailyMetrics.TotalCalories / user.CalorieGoal * 100) : 0;
        var proteinPct = user.ProteinGoal > 0 ? (dailyMetrics.TotalProtein / user.ProteinGoal * 100) : 0;
        var carbsPct = user.CarbsGoal > 0 ? (dailyMetrics.TotalCarbs / user.CarbsGoal * 100) : 0;
        var fatPct = user.FatGoal > 0 ? (dailyMetrics.TotalFat / user.FatGoal * 100) : 0;
        prompt += $"- Calories: {dailyMetrics.TotalCalories:F0} / {user.CalorieGoal} kcal ({caloriePct:F1}%)\n";
        prompt += $"- Protein: {dailyMetrics.TotalProtein:F1} / {user.ProteinGoal} g ({proteinPct:F1}%)\n";
        prompt += $"- Carbs: {dailyMetrics.TotalCarbs:F1} / {user.CarbsGoal} g ({carbsPct:F1}%)\n";
        prompt += $"- Fat: {dailyMetrics.TotalFat:F1} / {user.FatGoal} g ({fatPct:F1}%)\n";

        // Add remaining needs
        prompt += $"\nRemaining Needs Today:\n";
        prompt += $"- Calories: {remainingCalories} kcal\n";
        prompt += $"- Protein: {remainingProtein} g\n";
        prompt += $"- Carbs: {remainingCarbs} g\n";
        prompt += $"- Fat: {remainingFat} g\n";

        // Add recent entries
        if (recentEntries.Any())
        {
            prompt += $"\nRecent Food Entries (last 5):\n";
            foreach (var entry in recentEntries)
            {
                prompt += $"- {entry.Food?.Name ?? "Unknown"}: {entry.Grams:F0}g ({entry.Calories:F0} kcal, P: {entry.Protein:F1}g, C: {entry.Carbs:F1}g, F: {entry.Fat:F1}g)\n";
            }
        }

        // Add top foods
        if (topFoods.Any())
        {
            prompt += $"\nMost Used Foods:\n";
            foreach (var food in topFoods)
            {
                prompt += $"- {food.Name} (logged {food.Count} times)\n";
            }
        }

        prompt += "\nUse this context to provide personalized recommendations. When suggesting foods or meals, consider what the user still needs to meet their goals. Reference their recent eating patterns when relevant.";

        return prompt;
    }
}
