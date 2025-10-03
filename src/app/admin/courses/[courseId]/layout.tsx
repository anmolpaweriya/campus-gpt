import { ReactNode } from "react";
import { SubjectProvider } from "./subject.provider";

export default function Layout({ children }: { children: ReactNode }) {
  return <SubjectProvider>{children}</SubjectProvider>;
}
