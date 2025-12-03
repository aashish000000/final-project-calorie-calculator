using System.Text;
using System.Text.Json;
using CalorieCalculator.Api.Data;
using CalorieCalculator.Api.DTOs;
using Microsoft.EntityFrameworkCore;

namespace CalorieCalculator.Api.Services;

public interface IChatService
{
    Task<ChatResponse> GetResponseAsync(int userId, ChatRequest request);
}

public class ChatService : IChatService
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _configuration;
    private readonly HttpClient _httpClient;

    public ChatService(AppDbContext context, IConfiguration configuration, IHttpClientFactory httpClientFactory)
    {
        _context = context;
        _configuration = configuration;
        _httpClient = httpClientFactory.CreateClient();
    }

    public async Task<ChatResponse> GetResponseAsync(int userId, ChatRequest request)
    {
        var apiKey = _configuration["OpenAI:ApiKey"];
        
        // If no API key, use fallback responses
        if (string.IsNullOrEmpty(apiKey))
        {
            return GetFallbackResponse(request.Message);
        }

        try
        {
            // Get user's context
            var userContext = await GetUserContextAsync(userId);
            
            // Build messages for OpenAI
            var messages = BuildMessages(request, userContext);
            
            // Call OpenAI API
            var response = await CallOpenAIAsync(apiKey, messages);
            
            return new ChatResponse
            {
                Message = response,
                SuggestedAction = DetectAction(response)
            };
        }
        catch (Exception ex)
        {
            Console.WriteLine($"OpenAI Error: {ex.Message}");
            return GetFallbackResponse(request.Message);
        }
    }

    private async Task<string> GetUserContextAsync(int userId)
    {
        var today = DateTime.UtcNow.Date;
        var tomorrow = today.AddDays(1);

        // Get today's totals
        var todayEntries = await _context.EntryItems
            .Where(e => e.UserId == userId && e.CreatedAt >= today && e.CreatedAt < tomorrow)
            .ToListAsync();

        var totalCalories = todayEntries.Sum(e => e.Calories);
        var totalProtein = todayEntries.Sum(e => e.Protein);
        var totalCarbs = todayEntries.Sum(e => e.Carbs);
        var totalFat = todayEntries.Sum(e => e.Fat);

        // Get available foods
        var foods = await _context.Foods
            .Where(f => f.UserId == null || f.UserId == userId)
            .Take(20)
            .Select(f => new { f.Name, f.CaloriesPer100g, f.ProteinPer100g })
            .ToListAsync();

        var foodList = string.Join(", ", foods.Select(f => $"{f.Name} ({f.CaloriesPer100g} cal, {f.ProteinPer100g}g protein per 100g)"));

        return $@"
User's Today Stats:
- Calories: {totalCalories:F0} kcal
- Protein: {totalProtein:F1}g
- Carbs: {totalCarbs:F1}g
- Fat: {totalFat:F1}g

Available Foods in Database:
{foodList}
";
    }

    private List<object> BuildMessages(ChatRequest request, string userContext)
    {
        var systemPrompt = $@"You are a friendly nutrition assistant for a calorie tracking app. Your role is to:
1. Answer nutrition questions accurately and helpfully
2. Suggest foods to help users meet their macro goals
3. Provide meal ideas and healthy eating tips
4. Help users understand their daily intake

Be concise but helpful. Use emojis occasionally to be friendly.
When suggesting foods, mention specific items from the user's available foods when relevant.

Current User Context:
{userContext}

Guidelines:
- If asked about adding food, suggest they use the 'Log Meal' feature
- Give specific, actionable advice
- Be encouraging about their progress
- If they ask to log food, tell them to click '+ Log Meal' button";

        var messages = new List<object>
        {
            new { role = "system", content = systemPrompt }
        };

        // Add history
        if (request.History != null)
        {
            foreach (var msg in request.History.TakeLast(10))
            {
                messages.Add(new { role = msg.Role, content = msg.Content });
            }
        }

        // Add current message
        messages.Add(new { role = "user", content = request.Message });

        return messages;
    }

    private async Task<string> CallOpenAIAsync(string apiKey, List<object> messages)
    {
        var requestBody = new
        {
            model = "gpt-3.5-turbo",
            messages = messages,
            max_tokens = 500,
            temperature = 0.7
        };

        var json = JsonSerializer.Serialize(requestBody);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        _httpClient.DefaultRequestHeaders.Clear();
        _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {apiKey}");

        var response = await _httpClient.PostAsync("https://api.openai.com/v1/chat/completions", content);
        var responseJson = await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
        {
            throw new Exception($"OpenAI API error: {responseJson}");
        }

        using var doc = JsonDocument.Parse(responseJson);
        var messageContent = doc.RootElement
            .GetProperty("choices")[0]
            .GetProperty("message")
            .GetProperty("content")
            .GetString();

        return messageContent ?? "I couldn't generate a response. Please try again.";
    }

    private string? DetectAction(string response)
    {
        var lowerResponse = response.ToLower();
        if (lowerResponse.Contains("log meal") || lowerResponse.Contains("add food"))
            return "log_food";
        if (lowerResponse.Contains("foods page") || lowerResponse.Contains("food database"))
            return "view_foods";
        return null;
    }

    private ChatResponse GetFallbackResponse(string message)
    {
        var lowerMessage = message.ToLower();

        // Pattern matching for common questions
        if (lowerMessage.Contains("protein") && (lowerMessage.Contains("high") || lowerMessage.Contains("more") || lowerMessage.Contains("hit")))
        {
            return new ChatResponse
            {
                Message = "🥩 Great high-protein foods include:\n\n" +
                          "• **Chicken Breast** - 31g protein per 100g\n" +
                          "• **Salmon** - 20g protein per 100g\n" +
                          "• **Greek Yogurt** - 10g protein per 100g\n" +
                          "• **Eggs** - 13g protein per 100g\n" +
                          "• **Almonds** - 21g protein per 100g\n\n" +
                          "Try adding these to your meals! Click '+ Log Meal' to track them.",
                SuggestedAction = "log_food"
            };
        }

        if (lowerMessage.Contains("calorie") && (lowerMessage.Contains("low") || lowerMessage.Contains("less") || lowerMessage.Contains("cut")))
        {
            return new ChatResponse
            {
                Message = "🥗 Here are some low-calorie options:\n\n" +
                          "• **Broccoli** - Only 34 cal per 100g\n" +
                          "• **Apple** - 52 cal per 100g\n" +
                          "• **Greek Yogurt** - 59 cal per 100g\n\n" +
                          "These are filling but won't break your calorie budget!",
                SuggestedAction = "view_foods"
            };
        }

        if (lowerMessage.Contains("breakfast") || lowerMessage.Contains("morning"))
        {
            return new ChatResponse
            {
                Message = "🌅 Great breakfast ideas:\n\n" +
                          "• **Oatmeal** (68 cal/100g) with a banana\n" +
                          "• **Eggs** (155 cal/100g) - scrambled or boiled\n" +
                          "• **Greek Yogurt** with almonds\n\n" +
                          "A protein-rich breakfast keeps you full longer!"
            };
        }

        if (lowerMessage.Contains("log") || lowerMessage.Contains("add") || lowerMessage.Contains("track"))
        {
            return new ChatResponse
            {
                Message = "📝 To log a meal:\n\n" +
                          "1. Click the **'+ Log Meal'** button\n" +
                          "2. Select a food from the dropdown\n" +
                          "3. Enter the amount in grams\n" +
                          "4. Click 'Log Entry'\n\n" +
                          "Your dashboard will update automatically!",
                SuggestedAction = "log_food"
            };
        }

        if (lowerMessage.Contains("help") || lowerMessage.Contains("how"))
        {
            return new ChatResponse
            {
                Message = "👋 I'm your nutrition assistant! I can help with:\n\n" +
                          "• 🍗 **Food suggestions** - Ask me what to eat\n" +
                          "• 📊 **Nutrition tips** - How to hit your macros\n" +
                          "• 🥗 **Meal ideas** - Breakfast, lunch, dinner\n" +
                          "• ❓ **App help** - How to log foods\n\n" +
                          "Just ask me anything about nutrition!"
            };
        }

        // Default response
        return new ChatResponse
        {
            Message = "🤔 I'm here to help with nutrition questions!\n\n" +
                      "Try asking me:\n" +
                      "• \"What foods are high in protein?\"\n" +
                      "• \"What should I eat for breakfast?\"\n" +
                      "• \"How do I log a meal?\"\n" +
                      "• \"Low calorie food options?\"\n\n" +
                      "💡 **Tip:** Add your OpenAI API key in settings for smarter AI responses!"
        };
    }
}

