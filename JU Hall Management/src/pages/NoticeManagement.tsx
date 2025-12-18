import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { 
  ChevronRight, 
  Plus, 
  Edit, 
  FileText,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { NoticeModal } from "@/components/modals/NoticeModal";
import type { Notice } from "@/components/notifications/NotificationBell";

const NOTICES_STORAGE_KEY = "ju_hall_notices";

export default function NoticeManagement() {
  const { isSupervisor } = useAuth();
  const navigate = useNavigate();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);

  useEffect(() => {
    if (!isSupervisor) {
      navigate("/");
      return;
    }

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

    loadNotices();
  }, [isSupervisor, navigate]);

  const handleEditNotice = (notice: Notice) => {
    setEditingNotice(notice);
    setIsModalOpen(true);
  };

  const handleAddNotice = () => {
    setEditingNotice(null);
    setIsModalOpen(true);
  };

  const handleSaveNotice = () => {
    // Reload notices from storage
    const stored = localStorage.getItem(NOTICES_STORAGE_KEY);
    if (stored) {
      setNotices(JSON.parse(stored));
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

  if (!isSupervisor) {
    return null;
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">Notice Management</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Notice Management</h1>
              <p className="text-muted-foreground">
                Create and manage notices for students
              </p>
            </div>
            <Button className="glow-button gap-2" onClick={handleAddNotice}>
              <Plus className="w-4 h-4" />
              Publish Notice
            </Button>
          </div>
        </motion.div>

        {/* Notices List */}
        {notices.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-12 rounded-2xl text-center"
          >
            <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No notices yet</h3>
            <p className="text-muted-foreground mb-4">
              Publish your first notice to inform students
            </p>
            <Button className="glow-button gap-2" onClick={handleAddNotice}>
              <Plus className="w-4 h-4" />
              Publish Notice
            </Button>
          </motion.div>
        ) : (
          <div className="grid gap-4">
            {notices
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((notice, index) => (
                <motion.div
                  key={notice.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass-card p-6 rounded-2xl"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {notice.priority === "urgent" && (
                          <AlertTriangle className="w-5 h-5 text-destructive" />
                        )}
                        <h3 className="text-lg font-semibold">{notice.title}</h3>
                        <Badge className={getPriorityColor(notice.priority)} variant="secondary">
                          {notice.priority}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-3 line-clamp-2">
                        {notice.content}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Published on{" "}
                        {new Date(notice.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        {" by "}
                        {notice.createdBy}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => handleEditNotice(notice)}
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </Button>
                  </div>
                </motion.div>
              ))}
          </div>
        )}
      </div>

      <NoticeModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        editingNotice={editingNotice}
        onSave={handleSaveNotice}
      />
    </div>
  );
}
