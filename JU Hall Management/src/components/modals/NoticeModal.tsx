import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import type { Notice } from "@/components/notifications/NotificationBell";

interface NoticeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingNotice?: Notice | null;
  onSave: (notice: Notice) => void;
}

const NOTICES_STORAGE_KEY = "ju_hall_notices";

export function NoticeModal({ open, onOpenChange, editingNotice, onSave }: NoticeModalProps) {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [priority, setPriority] = useState<Notice["priority"]>("normal");

  useEffect(() => {
    if (editingNotice) {
      setTitle(editingNotice.title);
      setContent(editingNotice.content);
      setPriority(editingNotice.priority);
    } else {
      setTitle("");
      setContent("");
      setPriority("normal");
    }
  }, [editingNotice, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    const notice: Notice = {
      id: editingNotice?.id || `notice-${Date.now()}`,
      title: title.trim(),
      content: content.trim(),
      priority,
      createdAt: editingNotice?.createdAt || new Date().toISOString(),
      createdBy: user?.name || "Supervisor",
    };

    // Save to localStorage
    const stored = localStorage.getItem(NOTICES_STORAGE_KEY);
    let notices: Notice[] = stored ? JSON.parse(stored) : [];

    if (editingNotice) {
      notices = notices.map((n) => (n.id === editingNotice.id ? notice : n));
      toast.success("Notice updated successfully");
    } else {
      notices.push(notice);
      toast.success("Notice published successfully");
    }

    localStorage.setItem(NOTICES_STORAGE_KEY, JSON.stringify(notices));
    
    // Trigger storage event for other components
    window.dispatchEvent(new Event("storage"));

    onSave(notice);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{editingNotice ? "Edit Notice" : "Publish Notice"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title *</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Notice title"
              required
              className="h-11 bg-secondary border-0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Content *</label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your notice content..."
              required
              rows={5}
              className="bg-secondary border-0 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Priority</label>
            <Select value={priority} onValueChange={(v) => setPriority(v as Notice["priority"])}>
              <SelectTrigger className="h-11 bg-secondary border-0">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="glow-button">
              {editingNotice ? "Update Notice" : "Publish Notice"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
