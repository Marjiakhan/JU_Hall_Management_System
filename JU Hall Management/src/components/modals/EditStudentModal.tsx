import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { UserCog, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useAuth } from "@/contexts/AuthContext";
import type { Student, Floor } from "@/hooks/useHallData";

interface EditStudentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: Student | null;
  currentFloorId: number;
  currentRoomId: number;
  floors: Floor[];
  onUpdateStudent: (
    oldFloorId: number,
    oldRoomId: number,
    studentId: string,
    updatedData: Partial<Student>,
    newFloorId?: number,
    newRoomId?: number
  ) => void;
}

const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

export function EditStudentModal({
  open,
  onOpenChange,
  student,
  currentFloorId,
  currentRoomId,
  floors,
  onUpdateStudent,
}: EditStudentModalProps) {
  const { toast } = useToast();
  const { isSupervisor, user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    district: "",
    bloodGroup: "",
    department: "",
    batch: "",
    status: "regular" as "regular" | "irregular",
  });
  const [selectedFloorId, setSelectedFloorId] = useState<number>(currentFloorId);
  const [selectedRoomId, setSelectedRoomId] = useState<number>(currentRoomId);

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || "",
        email: student.email || "",
        phone: student.phone || "",
        dob: student.dob || "",
        district: student.district || "",
        bloodGroup: student.bloodGroup || "",
        department: student.department || "",
        batch: student.batch || "",
        status: student.status || "regular",
      });
      setSelectedFloorId(currentFloorId);
      setSelectedRoomId(currentRoomId);
    }
  }, [student, currentFloorId, currentRoomId]);

  // Check if current user is the student being edited (for student self-edit)
  const isOwnProfile = user?.email === student?.email;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!student) return;

    // Students can only edit their own profile
    if (!isSupervisor && !isOwnProfile) {
      toast({
        title: "Access Denied",
        description: "You can only edit your own profile.",
        variant: "destructive",
      });
      return;
    }

    // Students cannot change room/floor
    const newFloor = isSupervisor ? selectedFloorId : currentFloorId;
    const newRoom = isSupervisor ? selectedRoomId : currentRoomId;

    onUpdateStudent(
      currentFloorId,
      currentRoomId,
      student.id,
      formData,
      newFloor !== currentFloorId || newRoom !== currentRoomId ? newFloor : undefined,
      newFloor !== currentFloorId || newRoom !== currentRoomId ? newRoom : undefined
    );

    toast({
      title: "Profile Updated",
      description: `${formData.name}'s profile has been updated successfully.`,
    });

    onOpenChange(false);
  };

  const selectedFloor = floors.find((f) => f.id === selectedFloorId);
  const availableRooms = selectedFloor?.rooms.filter(
    (r) => r.students.length < 4 || r.id === currentRoomId
  ) || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCog className="w-5 h-5 text-primary" />
            Edit Student Profile
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name *</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="bg-secondary border-0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-secondary border-0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="bg-secondary border-0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date of Birth</label>
              <Input
                type="date"
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                className="bg-secondary border-0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">District</label>
              <Input
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="bg-secondary border-0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Blood Group</label>
              <Select
                value={formData.bloodGroup}
                onValueChange={(value) => setFormData({ ...formData, bloodGroup: value })}
              >
                <SelectTrigger className="bg-secondary border-0">
                  <SelectValue placeholder="Select blood group" />
                </SelectTrigger>
                <SelectContent>
                  {bloodGroups.map((bg) => (
                    <SelectItem key={bg} value={bg}>
                      {bg}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Department</label>
              <Input
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="bg-secondary border-0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Batch</label>
              <Input
                value={formData.batch}
                onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                className="bg-secondary border-0"
              />
            </div>
          </div>

          {/* Room/Floor selection and Status - only for supervisors */}
          {isSupervisor && (
            <>
              <div className="space-y-2 pt-2 border-t border-border">
                <label className="block text-sm font-medium mb-1">Student Status</label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value as "regular" | "irregular" })}
                >
                  <SelectTrigger className="bg-secondary border-0">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="regular">Regular</SelectItem>
                    <SelectItem value="irregular">Irregular</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-sm font-medium mb-1">Floor</label>
                  <Select
                    value={selectedFloorId.toString()}
                    onValueChange={(value) => {
                      setSelectedFloorId(Number(value));
                      setSelectedRoomId(0);
                    }}
                  >
                    <SelectTrigger className="bg-secondary border-0">
                      <SelectValue placeholder="Select floor" />
                    </SelectTrigger>
                    <SelectContent>
                      {floors.map((floor) => (
                        <SelectItem key={floor.id} value={floor.id.toString()}>
                          {floor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Room</label>
                  <Select
                    value={selectedRoomId.toString()}
                    onValueChange={(value) => setSelectedRoomId(Number(value))}
                  >
                    <SelectTrigger className="bg-secondary border-0">
                      <SelectValue placeholder="Select room" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableRooms.map((room) => (
                        <SelectItem key={room.id} value={room.id.toString()}>
                          Room {room.id} ({room.students.length}/4)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1 glow-button gap-2">
              <Save className="w-4 h-4" />
              Save Changes
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
