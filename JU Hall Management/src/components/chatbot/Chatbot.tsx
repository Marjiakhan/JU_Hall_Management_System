import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const initialMessages: Message[] = [
  {
    id: "welcome",
    role: "assistant",
    content: "👋 Hello! I'm HallHelp, your AI assistant for hall management. How can I help you today?\n\nI can help you with:\n• Registration process\n• Room changes\n• Emergency assistance\n• Hall rules and policies",
    timestamp: new Date(),
  },
];

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { isSupervisor, isStudent, user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response (replace with actual API call when backend is connected)
    setTimeout(() => {
      const responses = getAIResponse(input);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responses,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const getAIResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes("emergency") || lowerQuery.includes("ambulance") || lowerQuery.includes("জরুরি")) {
      return "🚨 I understand you need emergency assistance!\n\n[ACTION: call_ambulance]\n\nPlease go to the Emergency page immediately or call our 24/7 helpline. Would you like me to help you submit an emergency request?";
    }
    
    if (lowerQuery.includes("register") || lowerQuery.includes("নিবন্ধন")) {
      return "📝 To register for a room:\n\n1. Go to the Register page\n2. Fill in your details (name, department, batch)\n3. Upload your student ID\n4. Choose preferred floor\n5. Submit and wait for approval\n\n[ACTION: view_register]";
    }
    
    if (lowerQuery.includes("room") || lowerQuery.includes("change") || lowerQuery.includes("কক্ষ")) {
      return "🔄 For room changes:\n\n1. Visit the admin office during hours (9 AM - 5 PM)\n2. Fill out room change request form\n3. State your reason\n4. Wait for approval (usually 3-5 days)\n\nNeed help with something specific?";
    }
    
    if (lowerQuery.includes("rule") || lowerQuery.includes("policy") || lowerQuery.includes("নিয়ম")) {
      return "📋 Hall Rules:\n\n• Quiet hours: 10 PM - 6 AM\n• Visitors allowed until 8 PM\n• Keep common areas clean\n• No smoking in premises\n• Report maintenance issues promptly\n\n[ACTION: view_rules]";
    }

    // Supervisor-specific responses
    if (isSupervisor) {
      if (lowerQuery.includes("add") || lowerQuery.includes("create")) {
        return "As a supervisor, you can:\n\n[ACTION: add_student] - Add new students\n[ACTION: add_room] - Add new rooms\n[ACTION: add_floor] - Add new floors\n\nGo to the Floors page to manage hall resources.";
      }
      if (lowerQuery.includes("dashboard") || lowerQuery.includes("stats") || lowerQuery.includes("analytics")) {
        return "📊 As a supervisor, you have access to:\n\n[ACTION: open_dashboard] - Admin Dashboard\n• View hall statistics\n• Manage emergency requests\n• View logs and reports\n\nWhat would you like to do?";
      }
      if (lowerQuery.includes("delete") || lowerQuery.includes("remove")) {
        return "⚠️ To remove a student:\n\n1. Go to Floors → Select Floor\n2. Find the student's room\n3. Click on the student card\n4. Use the Delete button\n\n[ACTION: view_floors]";
      }
    }

    // Student-specific responses
    if (isStudent) {
      if (lowerQuery.includes("add") || lowerQuery.includes("delete") || lowerQuery.includes("remove") || lowerQuery.includes("dashboard")) {
        return "ℹ️ As a student, you can:\n\n• View floors and rooms\n• Search for students\n• Request emergency services\n• View hall rules\n\nFor administrative tasks, please contact your Hall Supervisor.";
      }
    }
    
    // Default response based on role
    if (isSupervisor) {
      return "I'm here to help! As a supervisor, you can:\n\n• 📝 Manage students, rooms & floors\n• 📊 Access dashboard & analytics\n• 🚨 Handle emergency requests\n• 📋 View logs & reports\n\n[ACTION: open_dashboard]\n\nWhat would you like to do?";
    }
    
    return "I'm here to help! You can ask me about:\n\n• 📝 Registration process\n• 🏠 Room allocation\n• 🔄 Room changes\n• 🚨 Emergency services\n• 📋 Hall rules\n\nWhat would you like to know?";
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg",
          "flex items-center justify-center chatbot-pulse",
          isOpen && "hidden"
        )}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Open chat"
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-6rem)] flex flex-col glass-card rounded-2xl overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-primary/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">HallHelp</h3>
                  <p className="text-xs text-muted-foreground">AI Assistant</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={cn(
                    "flex gap-3",
                    message.role === "user" && "flex-row-reverse"
                  )}
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                      message.role === "assistant"
                        ? "bg-primary/10 text-primary"
                        : "bg-secondary text-foreground"
                    )}
                  >
                    {message.role === "assistant" ? (
                      <Bot className="w-4 h-4" />
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                  </div>
                  <div
                    className={cn(
                      "max-w-[80%] p-3 rounded-2xl text-sm whitespace-pre-wrap",
                      message.role === "assistant"
                        ? "bg-secondary text-foreground rounded-tl-sm"
                        : "bg-primary text-primary-foreground rounded-tr-sm"
                    )}
                  >
                    {message.content}
                  </div>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                  <div className="bg-secondary p-3 rounded-2xl rounded-tl-sm">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-typing-dot" />
                      <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-typing-dot" />
                      <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-typing-dot" />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border bg-card/50">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex gap-2"
              >
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 bg-secondary border-0 focus-visible:ring-1 focus-visible:ring-primary"
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!input.trim() || isTyping}
                  className="shrink-0 glow-button"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
