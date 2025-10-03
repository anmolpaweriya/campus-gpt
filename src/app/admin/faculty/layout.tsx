import { ReactNode } from "react";
import { FacultyProvider } from "./faculty.provider";

export default function Layout({ children }: { children: ReactNode }) {
  return <FacultyProvider>{children}</FacultyProvider>;
}
