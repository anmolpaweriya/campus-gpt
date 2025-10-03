import { ReactNode } from "react";
import { CoursesProvider } from "./courses.provider";

export default function Layout({ children }: { children: ReactNode }) {
  return <CoursesProvider>{children}</CoursesProvider>;
}
