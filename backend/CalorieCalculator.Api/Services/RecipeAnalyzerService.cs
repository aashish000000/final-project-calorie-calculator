using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using CalorieCalculator.Api.DTOs;

namespace CalorieCalculator.Api.Services;

public class RecipeAnalyzerService : IRecipeAnalyzerService
{
    private readonly string? _apiKey;
    private readonly bool _isConfigured;
    private readonly HttpClient _httpClient;

    public RecipeAnalyzerService(OpenAiSettings openAiSettings, IHttpClientFactory httpClientFactory)
    {
        _httpClient = httpClientFactory.CreateClient();
        _apiKey = openAiSettings.ApiKey;
        _isConfigured = !string.IsNullOrWhiteSpace(_apiKey);
    }

    public async Task<RecipeAnalysisResponse> AnalyzeRecipeAsync(string recipeText, int? servings = null)
    {
        if (!_isConfigured)
        {
            throw new InvalidOperationException("OpenAI API key is not configured");
        }

        if (string.IsNullOrWhiteSpace(recipeText))
        {
            throw new ArgumentException("Recipe text cannot be empty", nameof(recipeText));
        }

        var prompt = BuildAnalysisPrompt(recipeText, servings);
        var requestBody = new
        {
            model = "gpt-4o-mini",
            messages = new[]
            {
                new { role = "system", content = "You are a professional nutritionist and recipe analyzer. Extract recipe details and calculate accurate nutrition information." },
                new { role = "user", content = prompt }
            },
            temperature = 0.3,
            max_tokens = 2000
        };

        var responseJson = await CallOpenAIAsync(requestBody);

        try
        {
            using var doc = JsonDocument.Parse(responseJson);
            var content = doc.RootElement
                .GetProperty("choices")[0]
                .GetProperty("message")
                .GetProperty("content")
                .GetString() ?? "";

            // Parse the JSON response from GPT
            var analysisJson = ExtractJsonFromResponse(content);
            return ParseRecipeAnalysis(analysisJson, servings);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Recipe analysis error: {ex.Message}");
            throw new Exception("Failed to analyze recipe. Please ensure the recipe is properly formatted.");
        }
    }

    private string BuildAnalysisPrompt(string recipeText, int? servings)
    {
        var servingsNote = servings.HasValue 
            ? $" The recipe should be calculated for {servings.Value} servings."
            : " Try to detect the number of servings from the recipe.";

        return $@"Analyze this recipe and extract ALL the information in JSON format.{servingsNote}

Recipe:
{recipeText}

Return ONLY a valid JSON object with this EXACT structure (no markdown, no code blocks):
{{
  ""recipeName"": ""Recipe Name"",
  ""servings"": 4,
  ""prepTimeMinutes"": 15,
  ""cookTimeMinutes"": 30,
  ""ingredients"": [
    {{
      ""name"": ""ingredient name"",
      ""quantity"": ""2"",
      ""unit"": ""cups"",
      ""calories"": 120,
      ""protein"": 5,
      ""carbs"": 20,
      ""fat"": 3
    }}
  ],
  ""instructions"": ""Step-by-step cooking instructions if provided in the recipe"",
  ""totalNutrition"": {{
    ""calories"": 480,
    ""protein"": 20,
    ""carbs"": 80,
    ""fat"": 12
  }},
  ""perServingNutrition"": {{
    ""calories"": 120,
    ""protein"": 5,
    ""carbs"": 20,
    ""fat"": 3
  }}
}}

Important:
- Calculate accurate nutrition for EACH ingredient
- Sum up to get total nutrition
- Divide by servings for per-serving nutrition
- If prep/cook time not provided, estimate based on recipe complexity
- Return ONLY the JSON object, no other text";
    }

    private string ExtractJsonFromResponse(string response)
    {
        // Remove markdown code blocks if present
        response = response.Trim();
        
        if (response.StartsWith("```json"))
        {
            response = response.Substring(7);
        }
        else if (response.StartsWith("```"))
        {
            response = response.Substring(3);
        }
        
        if (response.EndsWith("```"))
        {
            response = response.Substring(0, response.Length - 3);
        }
        
        return response.Trim();
    }

    private RecipeAnalysisResponse ParseRecipeAnalysis(string json, int? requestedServings)
    {
        var options = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        };

        var data = JsonSerializer.Deserialize<JsonElement>(json);

        var servings = requestedServings ?? data.GetProperty("servings").GetInt32();
        
        var response = new RecipeAnalysisResponse
        {
            RecipeName = data.GetProperty("recipeName").GetString() ?? "Untitled Recipe",
            Servings = servings,
            PrepTimeMinutes = data.TryGetProperty("prepTimeMinutes", out var prep) ? prep.GetInt32() : 0,
            CookTimeMinutes = data.TryGetProperty("cookTimeMinutes", out var cook) ? cook.GetInt32() : 0,
            Instructions = data.TryGetProperty("instructions", out var inst) ? inst.GetString() : null
        };

        // Parse ingredients
        if (data.TryGetProperty("ingredients", out var ingredientsArray))
        {
            foreach (var ing in ingredientsArray.EnumerateArray())
            {
                response.Ingredients.Add(new RecipeIngredient
                {
                    Name = ing.GetProperty("name").GetString() ?? "",
                    Quantity = ing.TryGetProperty("quantity", out var qty) ? qty.GetString() ?? "" : "",
                    Unit = ing.TryGetProperty("unit", out var unit) ? unit.GetString() ?? "" : "",
                    Calories = ing.TryGetProperty("calories", out var cal) ? cal.GetDecimal() : 0,
                    Protein = ing.TryGetProperty("protein", out var prot) ? prot.GetDecimal() : 0,
                    Carbs = ing.TryGetProperty("carbs", out var carbs) ? carbs.GetDecimal() : 0,
                    Fat = ing.TryGetProperty("fat", out var fat) ? fat.GetDecimal() : 0
                });
            }
        }

        // Parse total nutrition
        if (data.TryGetProperty("totalNutrition", out var total))
        {
            response.TotalNutrition = new RecipeNutrition
            {
                Calories = total.GetProperty("calories").GetDecimal(),
                Protein = total.GetProperty("protein").GetDecimal(),
                Carbs = total.GetProperty("carbs").GetDecimal(),
                Fat = total.GetProperty("fat").GetDecimal()
            };
        }

        // Parse per-serving nutrition
        if (data.TryGetProperty("perServingNutrition", out var perServing))
        {
            response.PerServingNutrition = new RecipeNutrition
            {
                Calories = perServing.GetProperty("calories").GetDecimal(),
                Protein = perServing.GetProperty("protein").GetDecimal(),
                Carbs = perServing.GetProperty("carbs").GetDecimal(),
                Fat = perServing.GetProperty("fat").GetDecimal()
            };
        }

        return response;
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
}
