namespace CalorieCalculator.Api.DTOs;

public class ChatRequest
{
    public string Message { get; set; } = string.Empty;

    // Optional conversation history from the frontend
    public List<ChatMessageDto>? History { get; set; }
}

public class ChatMessageDto
{
    /// <summary>
    /// "user" or "assistant"
    /// </summary>
    public string Sender { get; set; } = string.Empty;

    public string Text { get; set; } = string.Empty;
}

public class ChatResponse
{
    public string Reply { get; set; } = string.Empty;
}
