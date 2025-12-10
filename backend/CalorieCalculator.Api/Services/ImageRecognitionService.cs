using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using CalorieCalculator.Api.DTOs;

namespace CalorieCalculator.Api.Services;

public class ImageRecognitionService : IImageRecognitionService
{
    private readonly string? _apiKey;
    private readonly bool _isConfigured;
    private readonly HttpClient _httpClient;

    public ImageRecognitionService(OpenAiSettings openAiSettings, IHttpClientFactory httpClientFactory)
    {
        _httpClient = httpClientFactory.CreateClient();
        _apiKey = openAiSettings.ApiKey;
        _isConfigured = !string.IsNullOrWhiteSpace(_apiKey);
    }

    public async Task<ImageRecognitionResponse> AnalyzeFoodImageAsync(Stream imageStream)
    {
        if (!_isConfigured)
        {
            throw new InvalidOperationException("OpenAI API key is not configured");
        }

        // Convert image to base64
        using var memoryStream = new MemoryStream();
        await imageStream.CopyToAsync(memoryStream);
        var imageBytes = memoryStream.ToArray();
        var base64Image = Convert.ToBase64String(imageBytes);

        // Build the prompt for food recognition
        var prompt = @"Analyze this food image and identify all visible food items. For each item, provide:
1. Food name
2. Estimated portion size in grams
3. Estimated nutritional information (calories, protein, carbs, fat)

Be as accurate as possible with portion sizes. If you see multiple items, list each separately.

Respond in this exact JSON format:
{
  ""foods"": [
    {
      ""name"": ""Food name"",
      ""estimatedGrams"": 150,
      ""estimatedCalories"": 200,
      ""estimatedProtein"": 20,
      ""estimatedCarbs"": 15,
      ""estimatedFat"": 8,
      ""notes"": ""Any additional notes""
    }
  ],
  ""rawAnalysis"": ""Brief overall description of the meal""
}";

        try
        {
            // Create the request body for OpenAI Vision API
            var requestBody = new
            {
                model = "gpt-4o-mini",
                messages = new[]
                {
                    new
                    {
                        role = "user",
                        content = new object[]
                        {
                            new { type = "text", text = prompt },
                            new
                            {
                                type = "image_url",
                                image_url = new
                                {
                                    url = $"data:image/jpeg;base64,{base64Image}"
                                }
                            }
                        }
                    }
                },
                max_tokens = 1000
            };

            var response = await CallOpenAIAsync(requestBody);

            if (string.IsNullOrEmpty(response))
            {
                throw new Exception("Failed to get response from OpenAI");
            }

            // Parse the response
            using var doc = JsonDocument.Parse(response);
            
            // Check for errors
            if (doc.RootElement.TryGetProperty("error", out _))
            {
                Console.WriteLine($"OpenAI API error: {response}");
                throw new Exception("OpenAI API returned an error");
            }

            var content = doc.RootElement
                .GetProperty("choices")[0]
                .GetProperty("message")
                .GetProperty("content")
                .GetString();

            if (string.IsNullOrEmpty(content))
            {
                throw new Exception("Empty response from OpenAI");
            }

            // Extract JSON from markdown code blocks if present
            content = content.Trim();
            if (content.StartsWith("```json"))
            {
                content = content.Substring(7);
            }
            if (content.StartsWith("```"))
            {
                content = content.Substring(3);
            }
            if (content.EndsWith("```"))
            {
                content = content.Substring(0, content.Length - 3);
            }
            content = content.Trim();

            // Parse the food recognition result
            var result = JsonSerializer.Deserialize<ImageRecognitionResponse>(content, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            return result ?? new ImageRecognitionResponse
            {
                Foods = new List<RecognizedFood>(),
                RawAnalysis = "Failed to parse food recognition result"
            };
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Image recognition error: {ex.GetType().Name}: {ex.Message}");
            Console.WriteLine($"Stack trace: {ex.StackTrace}");
            throw;
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
}
