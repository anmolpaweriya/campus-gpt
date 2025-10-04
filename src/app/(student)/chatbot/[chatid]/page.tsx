"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, User, Sparkles, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

import { StudentNav } from "../../dashboard/partials/student-nav";
import { ChatSidebar } from "../partials/chat-sidebar";
import { useChatbotContext } from "../chatbot.provider";

export default function ChatbotPage() {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const {
    messages,
    isLoadingMessages,
    handleSendMessage,
    setMessages,
    isFetchingResponse,
  } = useChatbotContext();
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoadingMessages]);

  const simulateStreamingResponse = async (message: string) => {
    const words = message.split(" ");
    const messageId = Date.now().toString();
    setMessages((prev) => [
      ...prev,
      { id: messageId, role: "assistant", content: "", isStreaming: true },
    ]);

    for (let i = 0; i < words.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? { ...msg, content: words.slice(0, i + 1).join(" ") }
            : msg,
        ),
      );
    }

    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, isStreaming: false } : msg,
      ),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setIsLoading(true);
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        role: "user",
        content: userMessage,
        isStreaming: false,
      },
    ]);
    const aiResponse = await handleSendMessage(userMessage);

    await simulateStreamingResponse(aiResponse.content);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <StudentNav />
      <ChatSidebar />

      <main className="flex-1 flex flex-col md:ml-72 h-[calc(100vh-4rem)]">
        {/* Chat messages area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-40">
          {isLoadingMessages ? (
            <div className="w-full text-3xl h-svh text-gray-400 flex justify-center items-center">
              Loading ...
            </div>
          ) : (
            <div className="max-w-4xl mx-auto w-full space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500",
                    message.role === "user" ? "justify-end" : "justify-start",
                  )}
                >
                  {message.role === "assistant" && (
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-primary">
                      <Bot className="w-6 h-6 text-white" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-5 py-4 transition-all duration-300",
                      message.role === "user"
                        ? "bg-gradient-to-br from-primary to-accent text-white shadow-lg shadow-primary/20"
                        : "bg-secondary/50 text-foreground border-2 border-border/50 hover:border-primary/30",
                    )}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                      {message.isStreaming && (
                        <span className="inline-block w-1 h-4 bg-current ml-1 animate-pulse" />
                      )}
                    </p>
                  </div>
                  {message.role === "user" && (
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-chart-3 flex items-center justify-center glow-accent">
                      <User className="w-6 h-6 text-white" />
                    </div>
                  )}
                </div>
              ))}
              {isFetchingResponse && (
                <div className="flex gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 justify-start">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-primary">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div className="max-w-[80%] rounded-2xl px-5 py-4 bg-secondary/50 text-foreground border-2 border-border/50 hover:border-primary/30 transition-all duration-300">
                    <p className="text-sm leading-relaxed flex items-center gap-2">
                      <Loader2 className="animate-spin w-4 h-4 text-muted-foreground" />
                      Thinking...
                    </p>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="border-t-2 border-primary/20 p-4 bg-card/80 backdrop-blur-sm fixed bottom-0 w-full">
          <div className="max-w-4xl mx-auto w-full">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about classes, exams, faculty, events..."
                disabled={isLoading || isFetchingResponse}
                className="flex-1 bg-secondary/50 border-border/50 focus:border-primary h-12 text-base transition-all duration-300"
              />
              <Button
                type="submit"
                disabled={isLoading || !input.trim() || isFetchingResponse}
                size="icon"
                className="h-12 w-12 bg-gradient-to-br from-primary to-accent hover:from-primary/90 hover:to-accent/90 glow-primary transition-all duration-300"
              >
                {isFetchingResponse ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
