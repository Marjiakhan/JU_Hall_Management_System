import { useState } from "react";
import { Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface AddFloorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddFloor: (floorName: string) => void;
  nextFloorNumber: number;
}

export function AddFloorModal({ open, onOpenChange, onAddFloor, nextFloorNumber }: AddFloorModalProps) {
  const [floorName, setFloorName] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = floorName.trim() || `Floor ${nextFloorNumber}`;
    onAddFloor(name);
    setFloorName("");
    onOpenChange(false);
    toast({
      title: "Floor Added",
      description: `${name} has been added successfully.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            Add New Floor
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="floorNumber">Floor Number</Label>
            <Input
              id="floorNumber"
              value={nextFloorNumber}
              disabled
              className="bg-secondary/50"
            />
            <p className="text-xs text-muted-foreground">Auto-generated floor number</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="floorName">Floor Name (Optional)</Label>
            <Input
              id="floorName"
              placeholder={`e.g., Floor ${nextFloorNumber} or Second Floor`}
              value={floorName}
              onChange={(e) => setFloorName(e.target.value)}
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1 glow-button">
              Add Floor
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
