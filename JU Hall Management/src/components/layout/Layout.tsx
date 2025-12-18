import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Chatbot } from "@/components/chatbot/Chatbot";
import { NotificationBell } from "@/components/notifications/NotificationBell";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {/* Notification Bell - fixed below navbar */}
      <div className="fixed top-20 right-4 z-40">
        <NotificationBell />
      </div>
      <main className="pt-16">
        {children}
      </main>
      <Chatbot />
    </div>
  );
}
