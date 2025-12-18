import { useState, useEffect } from "react";
import { DoorOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { Floor } from "@/hooks/useHallData";

interface AddRoomModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddRoom: (floorId: number, roomNumber: number) => void;
  floors: Floor[];
  preselectedFloorId?: number;
}

export function AddRoomModal({ open, onOpenChange, onAddRoom, floors, preselectedFloorId }: AddRoomModalProps) {
  const [selectedFloorId, setSelectedFloorId] = useState<string>("");
  const [roomNumber, setRoomNumber] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (preselectedFloorId) {
      setSelectedFloorId(String(preselectedFloorId));
    }
  }, [preselectedFloorId, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFloorId) {
      toast({ title: "Error", description: "Please select a floor.", variant: "destructive" });
      return;
    }
    
    const roomNum = parseInt(roomNumber);
    if (isNaN(roomNum) || roomNum <= 0) {
      toast({ title: "Error", description: "Please enter a valid room number.", variant: "destructive" });
      return;
    }

    const floor = floors.find(f => f.id === parseInt(selectedFloorId));
    if (floor?.rooms.some(r => r.id === roomNum)) {
      toast({ title: "Error", description: "Room number already exists on this floor.", variant: "destructive" });
      return;
    }

    onAddRoom(parseInt(selectedFloorId), roomNum);
    setRoomNumber("");
    if (!preselectedFloorId) setSelectedFloorId("");
    onOpenChange(false);
    toast({
      title: "Room Added",
      description: `Room ${roomNum} has been added successfully.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DoorOpen className="w-5 h-5 text-primary" />
            Add New Room
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Select Floor</Label>
            <Select value={selectedFloorId} onValueChange={setSelectedFloorId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a floor" />
              </SelectTrigger>
              <SelectContent>
                {floors.map((floor) => (
                  <SelectItem key={floor.id} value={String(floor.id)}>
                    {floor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="roomNumber">Room Number</Label>
            <Input
              id="roomNumber"
              type="number"
              placeholder="e.g., 101, 201"
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">Each room can hold up to 4 students</p>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1 glow-button">
              Add Room
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
