import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface Notice {
  id: string;
  title: string;
  content: string;
  priority: "low" | "normal" | "high" | "urgent";
  createdAt: string;
  createdBy: string;
  isRead?: boolean;
}

const NOTICES_STORAGE_KEY = "ju_hall_notices";
const READ_NOTIFICATIONS_KEY = "ju_hall_read_notifications";

export function NotificationBell() {
  const { user, isStudent } = useAuth();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [readNotifications, setReadNotifications] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Load notices from localStorage
    const loadNotices = () => {
      const stored = localStorage.getItem(NOTICES_STORAGE_KEY);
      if (stored) {
        try {
          setNotices(JSON.parse(stored));
        } catch {
          setNotices([]);
        }
      }
    };

    // Load read notifications for this user
    const loadReadNotifications = () => {
      if (user?.id) {
        const stored = localStorage.getItem(`${READ_NOTIFICATIONS_KEY}_${user.id}`);
        if (stored) {
          try {
            setReadNotifications(JSON.parse(stored));
          } catch {
            setReadNotifications([]);
          }
        }
      }
    };

    loadNotices();
    loadReadNotifications();

    // Listen for storage changes (for real-time updates)
    const handleStorageChange = () => {
      loadNotices();
    };
    window.addEventListener("storage", handleStorageChange);
    
    // Also poll for changes every 5 seconds (for same-tab updates)
    const interval = setInterval(loadNotices, 5000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, [user?.id]);

  const unreadCount = notices.filter((n) => !readNotifications.includes(n.id)).length;

  const markAsRead = (noticeId: string) => {
    if (user?.id && !readNotifications.includes(noticeId)) {
      const updated = [...readNotifications, noticeId];
      setReadNotifications(updated);
      localStorage.setItem(`${READ_NOTIFICATIONS_KEY}_${user.id}`, JSON.stringify(updated));
    }
  };

  const markAllAsRead = () => {
    if (user?.id) {
      const allIds = notices.map((n) => n.id);
      setReadNotifications(allIds);
      localStorage.setItem(`${READ_NOTIFICATIONS_KEY}_${user.id}`, JSON.stringify(allIds));
    }
  };

  const getPriorityColor = (priority: Notice["priority"]) => {
    switch (priority) {
      case "urgent":
        return "bg-destructive text-destructive-foreground";
      case "high":
        return "bg-warning text-warning-foreground";
      case "normal":
        return "bg-primary text-primary-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  if (!isStudent) return null;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center font-medium"
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle>Notifications</SheetTitle>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                Mark all as read
              </Button>
            )}
          </div>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-8rem)] mt-4">
          {notices.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notices
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((notice) => {
                  const isRead = readNotifications.includes(notice.id);
                  return (
                    <motion.div
                      key={notice.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-lg border transition-colors cursor-pointer ${
                        isRead ? "bg-secondary/30" : "bg-secondary/70 border-primary/20"
                      }`}
                      onClick={() => markAsRead(notice.id)}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className={`font-medium ${isRead ? "text-muted-foreground" : ""}`}>
                          {notice.title}
                        </h4>
                        <Badge className={getPriorityColor(notice.priority)} variant="secondary">
                          {notice.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {notice.content}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(notice.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      {!isRead && (
                        <div className="w-2 h-2 bg-primary rounded-full absolute top-2 right-2" />
                      )}
                    </motion.div>
                  );
                })}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
