using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CalorieCalculator.Api.DTOs;
using Microsoft.Extensions.Configuration;
using OpenAI;
using OpenAI.Chat;

namespace CalorieCalculator.Api.Services;

public class ChatService : IChatService
{
    private readonly ChatClient _chatClient;

    public ChatService(IConfiguration configuration)
    {
        // Try config first, then environment variable
        var apiKey = configuration["OpenAI:ApiKey"]
                     ?? Environment.GetEnvironmentVariable("OPENAI_API_KEY");

        if (string.IsNullOrWhiteSpace(apiKey))
        {
            throw new InvalidOperationException(
                "OpenAI API key not configured. Set OpenAI:ApiKey or OPENAI_API_KEY.");
        }

        _chatClient = new ChatClient("gpt-4o-mini", apiKey);
    }

    public async Task<ChatResponse> GetResponseAsync(int userId, ChatRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Message))
        {
            return new ChatResponse
            {
                Reply = "Please ask a question about food or nutrition so I can help."
            };
        }

        var messages = new List<ChatMessage>();

        // System message
        messages.Add(ChatMessage.CreateSystemMessage(
            "You are a friendly nutrition assistant inside a calorie tracking app. " +
            "Give short, practical answers (2–4 sentences) with concrete food examples. " +
            "If the user asks for medical advice, tell them to speak to a doctor."));

        // Include conversation history if provided
        if (request.History != null)
        {
            foreach (var m in request.History)
            {
                if (!string.IsNullOrWhiteSpace(m.Text))
                {
                    if (m.Sender?.ToLower() == "user")
                    {
                        messages.Add(ChatMessage.CreateUserMessage(m.Text));
                    }
                    else
                    {
                        messages.Add(ChatMessage.CreateAssistantMessage(m.Text));
                    }
                }
            }
        }

        // Latest user question
        messages.Add(ChatMessage.CreateUserMessage(request.Message));

        try
        {
            var result = await _chatClient.CompleteChatAsync(messages);
            var replyText = result.Value.Content[0].Text.Trim();

            return new ChatResponse
            {
                Reply = string.IsNullOrWhiteSpace(replyText)
                    ? "I couldn't think of a good answer. Try asking in another way!"
                    : replyText
            };
        }
        catch (Exception ex)
        {
            // Log ex as needed
            return new ChatResponse
            {
                Reply = "Sorry, something went wrong while generating a response. Please try again."
            };
        }
    }
}
