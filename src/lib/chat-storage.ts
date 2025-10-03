export interface ChatRoom {
  id: string;
  title: string;
  createdAt: number;
  lastMessageAt: number;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
}

export interface ChatHistory {
  [chatId: string]: Message[];
}

const CHAT_ROOMS_KEY = "campus_gpt_chat_rooms";
const CHAT_HISTORY_KEY = "campus_gpt_chat_history";

export function getChatRooms(): ChatRoom[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(CHAT_ROOMS_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function saveChatRoom(room: ChatRoom) {
  const rooms = getChatRooms();
  const existingIndex = rooms.findIndex((r) => r.id === room.id);

  if (existingIndex >= 0) {
    rooms[existingIndex] = room;
  } else {
    rooms.unshift(room);
  }

  localStorage.setItem(CHAT_ROOMS_KEY, JSON.stringify(rooms));
}

export function deleteChatRoom(chatId: string) {
  const rooms = getChatRooms().filter((r) => r.id !== chatId);
  localStorage.setItem(CHAT_ROOMS_KEY, JSON.stringify(rooms));

  const history = getChatHistory();
  delete history[chatId];
  localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(history));
}

export function getChatHistory(): ChatHistory {
  if (typeof window === "undefined") return {};
  const stored = localStorage.getItem(CHAT_HISTORY_KEY);
  return stored ? JSON.parse(stored) : {};
}

export function saveChatMessages(chatId: string, messages: Message[]) {
  const history = getChatHistory();
  history[chatId] = messages;
  localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(history));
}

export function getChatMessages(chatId: string): Message[] {
  const history = getChatHistory();
  return history[chatId] || [];
}

export function generateChatId(): string {
  return `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function generateChatTitle(firstMessage: string): string {
  const words = firstMessage.split(" ").slice(0, 6);
  return words.join(" ") + (firstMessage.split(" ").length > 6 ? "..." : "");
}
