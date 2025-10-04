import { ReactNode } from "react";
import { DashboardProvider } from "./dashboard.provider";

export default function Layout({ children }: { children: ReactNode }) {
  return <DashboardProvider>{children}</DashboardProvider>;
}
