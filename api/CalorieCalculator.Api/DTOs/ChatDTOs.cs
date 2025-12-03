using System.ComponentModel.DataAnnotations;

namespace CalorieCalculator.Api.DTOs;

public class ChatRequest
{
    [Required]
    public string Message { get; set; } = string.Empty;
    
    public List<ChatMessageDto>? History { get; set; }
}

public class ChatMessageDto
{
    public string Role { get; set; } = string.Empty; // "user" or "assistant"
    public string Content { get; set; } = string.Empty;
}

public class ChatResponse
{
    public string Message { get; set; } = string.Empty;
    public string? SuggestedAction { get; set; } // Optional: "log_food", "view_foods", etc.
    public object? ActionData { get; set; } // Optional: Data for the action
}

