import { ReactNode } from "react";
import { ChatbotProvider } from "./chatbot.provider";

export default function Layout({ children }: { children: ReactNode }) {
  return <ChatbotProvider>{children}</ChatbotProvider>;
}
