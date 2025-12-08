"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import type { ChatMessage } from "@/lib/types";
import { FiMessageCircle, FiX, FiSend, FiLoader } from "react-icons/fi";

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "👋 Hi! I'm your nutrition assistant. Ask me anything about food and nutrition!",
    },
  ]);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setHasInteracted(true);

    // Prepare conversation history for API (exclude the initial welcome message)
    const conversationHistory = messages
      .filter((msg, idx) => idx > 0) // Skip first welcome message
      .map(msg => ({ role: msg.role, content: msg.content }));

    // Add user message
    const newMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: userMessage },
    ];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      // Call API with message and conversation history
      const response = await api.sendChatMessage(userMessage, conversationHistory);

      // Support both camelCase `reply` and PascalCase `Reply` from the API
      const replyText =
        (response as any).reply ??
        (response as any).Reply ??
        "";

      if (replyText && replyText.trim()) {
        setMessages([
          ...newMessages,
          { role: "assistant", content: replyText },
        ]);
      } else {
        throw new Error("Empty response");
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (action: string) => {
    if (action === "log") {
      router.push("/log");
      setIsOpen(false);
    } else if (action === "foods") {
      router.push("/foods");
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-lg transition-all duration-300 ${
          isOpen
            ? "bg-gray-600 hover:bg-gray-700"
            : "bg-primary-600 hover:bg-primary-700 animate-pulse"
        }`}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <FiX className="w-6 h-6 text-white" />
        ) : (
          <FiMessageCircle className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-primary-600 text-white p-4">
            <h3 className="font-semibold flex items-center gap-2">
              🤖 Nutrition Assistant
            </h3>
            <p className="text-sm text-primary-100">Ask me anything about food & nutrition</p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-96 min-h-64 bg-gray-50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    msg.role === "user"
                      ? "bg-primary-600 text-white rounded-br-md"
                      : "bg-white text-gray-800 rounded-bl-md shadow-sm border border-gray-100"
                  }`}
                >
                  <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl rounded-bl-md shadow-sm border border-gray-100">
                  <FiLoader className="w-5 h-5 animate-spin text-primary-600" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex gap-2">
            <button
              onClick={() => handleQuickAction("log")}
              className="text-xs px-3 py-1.5 bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors"
            >
              + Log Meal
            </button>
            <button
              onClick={() => handleQuickAction("foods")}
              className="text-xs px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
            >
              View Foods
            </button>
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 bg-white">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about nutrition..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="p-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FiSend className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
