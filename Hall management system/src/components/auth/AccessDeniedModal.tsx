import { motion, AnimatePresence } from "framer-motion";
import { ShieldX, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AccessDeniedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AccessDeniedModal({ isOpen, onClose }: AccessDeniedModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="glass-card p-8 rounded-3xl max-w-md w-full text-center relative">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-secondary transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
              
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", damping: 15 }}
                className="w-20 h-20 mx-auto mb-6 rounded-full bg-destructive/10 flex items-center justify-center"
              >
                <ShieldX className="w-10 h-10 text-destructive" />
              </motion.div>
              
              <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
              <p className="text-muted-foreground mb-6">
                Supervisor Access Only
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                You don't have permission to access this feature. Please contact your hall supervisor if you believe this is an error.
              </p>
              
              <Button onClick={onClose} className="w-full glow-button">
                Go Back
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
