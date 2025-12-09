import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Chatbot } from "@/components/chatbot/Chatbot";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        {children}
      </main>
      <Chatbot />
    </div>
  );
}
