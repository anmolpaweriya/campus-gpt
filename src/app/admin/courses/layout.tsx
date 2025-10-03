import { ReactNode } from "react";
import { CoursesProvider } from "./courses.provider";
import { FacultyProvider } from "../faculty/faculty.provider";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <FacultyProvider>
      <CoursesProvider>{children}</CoursesProvider>
    </FacultyProvider>
  );
}
