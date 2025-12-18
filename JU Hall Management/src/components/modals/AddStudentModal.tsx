import { useState, useEffect } from "react";
import { UserPlus } from "lucide-react";
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
import type { Floor, Student } from "@/hooks/useHallData";

interface AddStudentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddStudent: (floorId: number, roomId: number, studentData: Omit<Student, "id" | "photoUrl">) => void;
  floors: Floor[];
  preselectedFloorId?: number;
  preselectedRoomId?: number;
}

export function AddStudentModal({ 
  open, 
  onOpenChange, 
  onAddStudent, 
  floors,
  preselectedFloorId,
  preselectedRoomId 
}: AddStudentModalProps) {
  const [selectedFloorId, setSelectedFloorId] = useState<string>("");
  const [selectedRoomId, setSelectedRoomId] = useState<string>("");
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    department: "",
    batch: "",
    district: "",
    entryDate: new Date().toISOString().split("T")[0],
    dob: "",
    bloodGroup: "",
    phone: "",
    email: "",
    status: "regular" as "regular" | "irregular",
  });

  const selectedFloor = floors.find(f => f.id === parseInt(selectedFloorId));
  const availableRooms = selectedFloor?.rooms.filter(r => r.students.length < 4) || [];

  useEffect(() => {
    if (preselectedFloorId) {
      setSelectedFloorId(String(preselectedFloorId));
    }
    if (preselectedRoomId) {
      setSelectedRoomId(String(preselectedRoomId));
    }
  }, [preselectedFloorId, preselectedRoomId, open]);

  const resetForm = () => {
    setFormData({
      name: "",
      department: "",
      batch: "",
      district: "",
      entryDate: new Date().toISOString().split("T")[0],
      dob: "",
      bloodGroup: "",
      phone: "",
      email: "",
      status: "regular",
    });
    if (!preselectedFloorId) setSelectedFloorId("");
    if (!preselectedRoomId) setSelectedRoomId("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFloorId || !selectedRoomId) {
      toast({ title: "Error", description: "Please select floor and room.", variant: "destructive" });
      return;
    }

    if (!formData.name.trim()) {
      toast({ title: "Error", description: "Student name is required.", variant: "destructive" });
      return;
    }

    const room = selectedFloor?.rooms.find(r => r.id === parseInt(selectedRoomId));
    if (room && room.students.length >= 4) {
      toast({ title: "Error", description: "This room is already full (max 4 students).", variant: "destructive" });
      return;
    }

    onAddStudent(parseInt(selectedFloorId), parseInt(selectedRoomId), formData);
    resetForm();
    onOpenChange(false);
    toast({
      title: "Student Added",
      description: `${formData.name} has been added successfully.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-primary" />
            Add New Student
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Select Floor</Label>
              <Select value={selectedFloorId} onValueChange={(v) => { setSelectedFloorId(v); setSelectedRoomId(""); }}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose floor" />
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
              <Label>Select Room</Label>
              <Select value={selectedRoomId} onValueChange={setSelectedRoomId} disabled={!selectedFloorId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose room" />
                </SelectTrigger>
                <SelectContent>
                  {availableRooms.map((room) => (
                    <SelectItem key={room.id} value={String(room.id)}>
                      Room {room.id} ({room.students.length}/4)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Student Name *</Label>
            <Input
              id="name"
              placeholder="Enter full name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                placeholder="e.g., Computer Science"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="batch">Batch</Label>
              <Input
                id="batch"
                placeholder="e.g., 2022"
                value={formData.batch}
                onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="district">Home District</Label>
              <Input
                id="district"
                placeholder="e.g., Dhaka"
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bloodGroup">Blood Group</Label>
              <Select value={formData.bloodGroup} onValueChange={(v) => setFormData({ ...formData, bloodGroup: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((bg) => (
                    <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                id="dob"
                type="date"
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="entryDate">Entry Date</Label>
              <Input
                id="entryDate"
                type="date"
                value={formData.entryDate}
                onChange={(e) => setFormData({ ...formData, entryDate: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone (11 digits)</Label>
              <Input
                id="phone"
                placeholder="01XXXXXXXXX"
                value={formData.phone}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 11);
                  setFormData({ ...formData, phone: value });
                }}
                maxLength={11}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="student@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Student Status</Label>
            <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v as "regular" | "irregular" })}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="regular">Regular</SelectItem>
                <SelectItem value="irregular">Irregular</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1 glow-button">
              Add Student
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
