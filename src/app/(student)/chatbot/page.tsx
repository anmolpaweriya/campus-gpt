"use client";

import { useEffect } from "react";
import { useChatbotContext } from "./chatbot.provider";

export default function ChatbotRedirect() {
  const { handleNewChat } = useChatbotContext();
  useEffect(() => {
    handleNewChat();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center w-full">
      <div className="animate-pulse text-muted-foreground">Loading chat...</div>
    </div>
  );
}
