"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, MessageSquare, Trash2, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useChatbotContext } from "../chatbot.provider";

export function ChatSidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const params = useParams();
  const currentChatId = params?.chatid as string;

  const { rooms, isLoadingRooms, handleNewChat, handleDeleteChat } =
    useChatbotContext();

  const handleDeleteChatClick = (chatId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleDeleteChat(chatId);
  };

  return (
    <>
      {/* Mobile toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-20 left-4 z-50 md:hidden bg-card/80 backdrop-blur-sm border border-border/50"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-16 h-[calc(100vh-4rem)] w-72 bg-gradient-to-b from-card/95 to-card/80 backdrop-blur-md border-r border-border/50 transition-transform duration-300 z-40",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full p-4">
          {/* New Chat Button */}
          <Button
            onClick={handleNewChat}
            className="w-full mb-4 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 glow-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Chat
          </Button>

          {/* Chat History */}
          <div className="flex-1 overflow-hidden">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 px-2">
              Chat History
            </h3>
            <ScrollArea className="h-[calc(100%-2rem)]">
              {isLoadingRooms ? (
                <div className="w-full h-full flex justify-center items-center">
                  Loading ...
                </div>
              ) : (
                <div className="space-y-2 grid gap-2 my-3">
                  {rooms.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                      <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      No chats yet
                    </div>
                  ) : (
                    rooms.map((room) => (
                      <Link key={room.id} href={`/chatbot/${room.id}`}>
                        <div
                          className={cn(
                            "group relative p-3 rounded-lg transition-all duration-200 hover:bg-primary/10 border border-transparent",
                            currentChatId === room.id &&
                              "bg-primary/10 border-primary/30 glow-primary",
                          )}
                        >
                          <div className="flex items-start gap-2">
                            <MessageSquare className="w-4 h-4 mt-1 flex-shrink-0 text-primary" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                {room.title?.slice(0, 10)}...
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(room.updatedAt).toLocaleDateString()}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 hover:bg-destructive/20 hover:text-destructive"
                              onClick={(e) => handleDeleteChatClick(room.id, e)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
