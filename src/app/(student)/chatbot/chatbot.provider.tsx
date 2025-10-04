"use client"; // For Next.js App Router (if using)

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  SetStateAction,
  Dispatch,
} from "react";
import {
  deleteChatRoom,
  getAllChatRoom,
  getChatRoomMessages,
  sendMessage,
  startNewChatRoom,
} from "./chatbot.api";
import { useAxios } from "@/services/axios/axios.hooks";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

// Define the shape of the context
type ChatbotContextType = {
  rooms: any[];
  isLoadingRooms: boolean;
  handleNewChat: () => Promise<void>;
  handleSendMessage: (message: string, file?: File) => Promise<any>;
  handleDeleteChat: (chatId: string) => Promise<void>;
  messages: any[];
  setMessages: Dispatch<SetStateAction<any[]>>;
  isLoadingMessages: boolean;
  isFetchingResponse: boolean;
};

// Create the context
const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

// Provider component
export const ChatbotProvider = ({ children }: { children: ReactNode }) => {
  const { axios } = useAxios();
  const router = useRouter();
  const params = useParams();
  const currentChatId = params?.chatid as string;
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isFetchingResponse, setIsFetchingResponse] = useState(false);

  const {
    data: rooms = [],
    isLoading: isLoadingRooms,
    refetch: refetchRooms,
  } = useQuery({
    queryKey: ["chat-rooms"],
    queryFn: async () => await getAllChatRoom(axios),
  });

  async function fetchChatRoomMessages() {
    setIsLoadingMessages(true);
    const data = await getChatRoomMessages(axios, currentChatId);
    setMessages(data);
    setIsLoadingMessages(false);
  }

  async function handleNewChat() {
    const data = await startNewChatRoom(axios);
    router.push(`/chatbot/${data?.id}`);
    refetchRooms();
  }
  async function handleDeleteChat(chatId: string) {
    await deleteChatRoom(axios, chatId);
    refetchRooms();
    toast("Room removed successfully");
  }

  async function handleSendMessage(message: string, file?: File) {
    setIsFetchingResponse(true);
    const data = await sendMessage(axios, {
      chatId: currentChatId,
      message,
      file,
    });
    setIsFetchingResponse(false);

    return data;
  }

  useEffect(() => {
    fetchChatRoomMessages();
  }, [currentChatId]);

  return (
    <ChatbotContext.Provider
      value={{
        rooms,
        isLoadingRooms,
        handleNewChat,
        messages,
        setMessages,
        isLoadingMessages,
        handleDeleteChat,
        handleSendMessage,
        isFetchingResponse,
      }}
    >
      {children}
    </ChatbotContext.Provider>
  );
};

// Hook to use the context
export const useChatbotContext = () => {
  const context = useContext(ChatbotContext);
  if (context === undefined) {
    throw new Error("useChatbotContext must be used within a ChatbotProvider");
  }
  return context;
};
