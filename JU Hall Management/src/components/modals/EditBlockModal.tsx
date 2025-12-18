import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Block } from "@/hooks/useHallData";

interface EditBlockModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  block: Block | null;
  onUpdateBlock: (blockId: string, name: string, description?: string) => void;
}

export function EditBlockModal({ open, onOpenChange, block, onUpdateBlock }: EditBlockModalProps) {
  const [blockName, setBlockName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (block) {
      setBlockName(block.name);
      setDescription(block.description || "");
    }
  }, [block]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!blockName.trim()) {
      toast.error("Block name is required");
      return;
    }

    if (!block) return;

    onUpdateBlock(block.id, blockName.trim(), description.trim() || undefined);
    onOpenChange(false);
    toast.success(`Block "${blockName}" updated successfully`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Block</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="blockName">Block Name *</Label>
              <Input
                id="blockName"
                value={blockName}
                onChange={(e) => setBlockName(e.target.value)}
                placeholder="e.g., A, B, C, East Wing"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter block description..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
