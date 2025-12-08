using System.Diagnostics;
using System.Text.Json;
using CalorieCalculator.Api.Data;
using CalorieCalculator.Api.DTOs;
using Microsoft.EntityFrameworkCore;

namespace CalorieCalculator.Api.Services;

public class SuggestionsService : ISuggestionsService
{
    private readonly AppDbContext _context;
    private readonly string? _apiKey;
    private readonly bool _isConfigured;

    public SuggestionsService(AppDbContext context, IConfiguration configuration)
    {
        _context = context;
        _apiKey = configuration["OpenAI:ApiKey"];
        _isConfigured = !string.IsNullOrWhiteSpace(_apiKey);
    }

    public async Task<FoodSuggestionsResponse> GetFoodSuggestionsAsync(int userId, DateTime? date = null)
    {
        if (!_isConfigured)
        {
            return new FoodSuggestionsResponse
            {
                Message = "AI suggestions are not configured",
                Suggestions = new List<SuggestedFood>()
            };
        }

        var targetDate = (date ?? DateTime.UtcNow).Date;

        // Get user goals
        var user = await _context.Users.FindAsync(userId);
        if (user == null)
        {
            throw new KeyNotFoundException("User not found");
        }

        // Get today's metrics
        var startOfDay = targetDate;
        var endOfDay = targetDate.AddDays(1);
        var entries = await _context.EntryItems
            .Include(e => e.Food)
            .Where(e => e.UserId == userId && e.CreatedAt >= startOfDay && e.CreatedAt < endOfDay)
            .ToListAsync();

        var totalCalories = entries.Sum(e => e.Food.CaloriesPer100g * e.Grams / 100m);
        var totalProtein = entries.Sum(e => e.Food.ProteinPer100g * e.Grams / 100m);
        var totalCarbs = entries.Sum(e => e.Food.CarbsPer100g * e.Grams / 100m);
        var totalFat = entries.Sum(e => e.Food.FatPer100g * e.Grams / 100m);

        var remaining = new RemainingNutrients
        {
            Calories = Math.Max(0, user.CalorieGoal - (int)totalCalories),
            Protein = Math.Max(0, user.ProteinGoal - totalProtein),
            Carbs = Math.Max(0, user.CarbsGoal - totalCarbs),
            Fat = Math.Max(0, user.FatGoal - totalFat)
        };

        // If goals are met, return success message
        if (remaining.Calories <= 50)
        {
            return new FoodSuggestionsResponse
            {
                Remaining = remaining,
                Message = "Great job! You've met your daily goals! 🎉",
                Suggestions = new List<SuggestedFood>()
            };
        }

        // Get AI suggestions
        var suggestions = await GetAISuggestionsAsync(remaining, entries);

        return new FoodSuggestionsResponse
        {
            Remaining = remaining,
            Suggestions = suggestions,
            Message = $"You have {remaining.Calories} calories remaining today"
        };
    }

    private async Task<List<SuggestedFood>> GetAISuggestionsAsync(
        RemainingNutrients remaining,
        List<CalorieCalculator.Api.Entities.EntryItem> todaysEntries)
    {
        var eatenFoods = string.Join(", ", todaysEntries.Select(e => e.Food.Name).Distinct());
        var prompt = BuildSuggestionsPrompt(remaining, eatenFoods);

        var requestBody = new
        {
            model = "gpt-4o-mini",
            messages = new[]
            {
                new { role = "system", content = "You are a nutrition expert providing personalized food suggestions." },
                new { role = "user", content = prompt }
            },
            temperature = 0.7,
            max_tokens = 1000
        };

        var jsonBody = JsonSerializer.Serialize(requestBody);
        var responseJson = await CallOpenAIWithCurl(jsonBody);

        try
        {
            using var doc = JsonDocument.Parse(responseJson);
            var content = doc.RootElement
                .GetProperty("choices")[0]
                .GetProperty("message")
                .GetProperty("content")
                .GetString() ?? "";

            return ParseSuggestions(content);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error parsing AI suggestions: {ex.Message}");
            return new List<SuggestedFood>();
        }
    }

    private string BuildSuggestionsPrompt(RemainingNutrients remaining, string eatenFoods)
    {
        return $@"The user needs to consume approximately:
- {remaining.Calories} more calories
- {remaining.Protein:F0}g more protein
- {remaining.Carbs:F0}g more carbs
- {remaining.Fat:F0}g more fat

They have already eaten: {(string.IsNullOrEmpty(eatenFoods) ? "nothing yet" : eatenFoods)}

Suggest 3-5 specific foods or meals that would help them meet their remaining goals. For each suggestion, provide:
1. Food name
2. Brief reason why it's a good choice
3. Estimated serving size in grams
4. Approximate macros (calories, protein, carbs, fat)

Format as JSON array:
[
  {{
    ""name"": ""Food name"",
    ""reason"": ""Why this helps"",
    ""estimatedGrams"": 150,
    ""calories"": 250,
    ""protein"": 20,
    ""carbs"": 30,
    ""fat"": 5
  }}
]

Return ONLY the JSON array, no markdown or other text.";
    }

    private List<SuggestedFood> ParseSuggestions(string content)
    {
        // Remove markdown code blocks if present
        content = content.Trim();
        if (content.StartsWith("```json"))
        {
            content = content.Substring(7);
        }
        else if (content.StartsWith("```"))
        {
            content = content.Substring(3);
        }
        if (content.EndsWith("```"))
        {
            content = content.Substring(0, content.Length - 3);
        }
        content = content.Trim();

        var options = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        };

        var suggestions = JsonSerializer.Deserialize<List<JsonElement>>(content, options);
        if (suggestions == null) return new List<SuggestedFood>();

        return suggestions.Select(s => new SuggestedFood
        {
            Name = s.GetProperty("name").GetString() ?? "",
            Reason = s.TryGetProperty("reason", out var reason) ? reason.GetString() ?? "" : "",
            EstimatedGrams = s.TryGetProperty("estimatedGrams", out var grams) ? grams.GetInt32() : 100,
            Calories = s.TryGetProperty("calories", out var cal) ? cal.GetDecimal() : 0,
            Protein = s.TryGetProperty("protein", out var prot) ? prot.GetDecimal() : 0,
            Carbs = s.TryGetProperty("carbs", out var carbs) ? carbs.GetDecimal() : 0,
            Fat = s.TryGetProperty("fat", out var fat) ? fat.GetDecimal() : 0
        }).ToList();
    }

    private async Task<string> CallOpenAIWithCurl(string jsonBody)
    {
        var tempFile = Path.GetTempFileName();
        await File.WriteAllTextAsync(tempFile, jsonBody);

        try
        {
            var process = new Process
            {
                StartInfo = new ProcessStartInfo
                {
                    FileName = "/usr/bin/curl",
                    Arguments = $"-s -X POST https://api.openai.com/v1/chat/completions " +
                               $"-H \"Content-Type: application/json\" " +
                               $"-H \"Authorization: Bearer {_apiKey}\" " +
                               $"-d @{tempFile}",
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    UseShellExecute = false,
                    CreateNoWindow = true
                }
            };

            process.Start();
            var output = await process.StandardOutput.ReadToEndAsync();
            var error = await process.StandardError.ReadToEndAsync();
            await process.WaitForExitAsync();

            if (!string.IsNullOrEmpty(error))
            {
                Console.WriteLine($"Curl error: {error}");
            }

            return output;
        }
        finally
        {
            if (File.Exists(tempFile))
            {
                File.Delete(tempFile);
            }
        }
    }
}
