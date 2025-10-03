"use client";

import { useChatbotContext } from "./chatbot.provider";
import { ChatSidebar } from "./partials/chat-sidebar";
import { StudentNav } from "../dashboard/partials/student-nav";
import {
  BookOpen,
  Calendar,
  GraduationCap,
  Loader2,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function ChatbotRedirect() {
  const { handleNewChat } = useChatbotContext();
  const [isStarting, setIsStarting] = useState(false);
  async function startNewChat() {
    setIsStarting(true);
    handleNewChat();
    setIsStarting(false);
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <StudentNav />
      <ChatSidebar />

      <main className="flex-1 flex flex-col md:ml-72 h-[calc(100vh-4rem)] ">
        <main className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
          <div className="w-full max-w-4xl">
            {/* Hero Section */}
            <div className="text-center space-y-8 animate-fade-in">
              {/* Icon */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
                  <div className="relative bg-gradient-to-br from-primary to-secondary p-6 rounded-3xl shadow-2xl">
                    <GraduationCap className="w-16 h-16 text-primary-foreground" />
                  </div>
                </div>
              </div>

              {/* Title */}
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl font-bold text-balance bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  📚 Campus GPT
                </h1>
                <p className="text-2xl md:text-3xl font-semibold text-foreground">
                  Your Smart College Assistant 🚀
                </p>
              </div>

              {/* Description */}
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
                Click below to chat and get help with timetables, notes, faculty
                info, and campus events.
              </p>

              {/* Features Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto pt-4">
                <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors">
                  <Calendar className="w-8 h-8 text-primary" />
                  <span className="text-sm font-medium text-card-foreground">
                    Timetables
                  </span>
                </div>
                <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card border border-border hover:border-secondary/50 transition-colors">
                  <BookOpen className="w-8 h-8 text-secondary" />
                  <span className="text-sm font-medium text-card-foreground">
                    Notes
                  </span>
                </div>
                <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card border border-border hover:border-accent/50 transition-colors">
                  <Users className="w-8 h-8 text-accent" />
                  <span className="text-sm font-medium text-card-foreground">
                    Faculty Info
                  </span>
                </div>
                <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors">
                  <GraduationCap className="w-8 h-8 text-primary" />
                  <span className="text-sm font-medium text-card-foreground">
                    Events
                  </span>
                </div>
              </div>

              {/* CTA Button */}
              <div className="pt-4">
                <Button
                  size="lg"
                  onClick={() => startNewChat()}
                  disabled={isStarting}
                  className="text-xl px-12 py-8 rounded-2xl bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_100%] hover:bg-[position:100%_0] transition-all duration-500 shadow-2xl hover:shadow-primary/50 hover:scale-105 font-semibold"
                >
                  {isStarting ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Starting ...
                    </>
                  ) : (
                    "Start Chat"
                  )}
                </Button>
              </div>

              {/* Subtle tagline */}
              <p className="text-sm text-muted-foreground pt-4">
                Powered by AI • Available 24/7 • Your Campus Companion
              </p>
            </div>
          </div>
        </main>
      </main>
    </div>
  );
}
