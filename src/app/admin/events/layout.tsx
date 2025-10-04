import { ReactNode } from "react";
import { EventProvider } from "./events.provider";

export default function Layout({ children }: { children: ReactNode }) {
  return <EventProvider>{children}</EventProvider>;
}
