import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ChevronRight, 
  Users, 
  Plus,
  UserPlus,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Droplet,
  GraduationCap,
  Building2,
  Edit,
  Trash2,
  DoorOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useHallData, type Student } from "@/hooks/useHallData";
import { AddRoomModal } from "@/components/modals/AddRoomModal";
import { AddStudentModal } from "@/components/modals/AddStudentModal";
import { EditStudentModal } from "@/components/modals/EditStudentModal";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { AccessDeniedModal } from "@/components/auth/AccessDeniedModal";

export default function FloorDetail() {
  const { floorId } = useParams();
  const { floors, addRoom, addStudent, deleteStudent, updateStudent } = useHallData();
  const { toast } = useToast();
  const { isSupervisor, isStudent, user } = useAuth();
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isEditStudentOpen, setIsEditStudentOpen] = useState(false);
  const [addStudentRoomId, setAddStudentRoomId] = useState<number | undefined>();
  const [showAccessDenied, setShowAccessDenied] = useState(false);

  const floorNumber = parseInt(floorId || "1");
  const floor = floors.find(f => f.id === floorNumber);
  const floorName = floor?.name || `Floor ${floorNumber}`;
  const rooms = floor?.rooms || [];

  const handleAdminAction = (action: () => void) => {
    if (isSupervisor) {
      action();
    } else {
      setShowAccessDenied(true);
    }
  };

  const handleStudentClick = (student: Student, roomId: number) => {
    setSelectedStudent(student);
    setSelectedRoomId(roomId);
    setIsProfileOpen(true);
  };

  const handleAddStudentToRoom = (roomId: number) => {
    handleAdminAction(() => {
      setAddStudentRoomId(roomId);
      setIsAddStudentOpen(true);
    });
  };

  const handleDeleteStudent = () => {
    if (selectedStudent && selectedRoomId) {
      deleteStudent(floorNumber, selectedRoomId, selectedStudent.id);
      setIsProfileOpen(false);
      toast({
        title: "Student Removed",
        description: `${selectedStudent.name} has been removed from Room ${selectedRoomId}.`,
      });
    }
  };

  const handleEditClick = () => {
    // Check if student is editing their own profile
    const isOwnProfile = user?.email === selectedStudent?.email;
    
    if (isSupervisor || isOwnProfile) {
      setIsProfileOpen(false);
      setIsEditStudentOpen(true);
    } else {
      toast({
        title: "Access Denied",
        description: "You can only edit your own profile.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateStudent = (
    oldFloorId: number,
    oldRoomId: number,
    studentId: string,
    updatedData: Partial<Student>,
    newFloorId?: number,
    newRoomId?: number
  ) => {
    updateStudent(oldFloorId, oldRoomId, studentId, updatedData, newFloorId, newRoomId);
  };

  // Check if current user can edit the selected student
  const canEditStudent = isSupervisor || (isStudent && user?.email === selectedStudent?.email);

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
            <Link to="/floors" className="hover:text-primary transition-colors">Floors</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">{floorName}</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{floorName}</h1>
              <p className="text-muted-foreground">
                {rooms.length} rooms • {rooms.reduce((acc, r) => acc + r.students.length, 0)} students
              </p>
            </div>
            {isSupervisor && (
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2 admin-only" onClick={() => handleAdminAction(() => { setAddStudentRoomId(undefined); setIsAddStudentOpen(true); })}>
                  <Users className="w-4 h-4" />
                  Add Student
                </Button>
                <Button className="glow-button gap-2 admin-only" onClick={() => handleAdminAction(() => setIsAddRoomOpen(true))}>
                  <Plus className="w-4 h-4" />
                  Add Room
                </Button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Rooms Grid */}
        {rooms.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <DoorOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Rooms Yet</h3>
            <p className="text-muted-foreground mb-4">
              {isSupervisor ? "Add your first room to this floor" : "No rooms available on this floor yet"}
            </p>
            {isSupervisor && (
              <Button className="glow-button gap-2 admin-only" onClick={() => handleAdminAction(() => setIsAddRoomOpen(true))}>
                <Plus className="w-4 h-4" />
                Add Room
              </Button>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {rooms.map((room, index) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
                className={cn(
                  "room-card",
                  room.students.length === 0 && "room-card-empty"
                )}
              >
                {/* Room Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-primary" />
                    <span className="font-semibold text-lg">Room {room.id}</span>
                  </div>
                  <Badge variant={room.students.length === 4 ? "default" : "secondary"}>
                    {room.students.length}/4
                  </Badge>
                </div>

                {/* Student Slots */}
                <div className="space-y-2">
                  {[0, 1, 2, 3].map((slotIndex) => {
                    const student = room.students[slotIndex];
                    return (
                      <div
                        key={slotIndex}
                        className={cn(
                          "student-slot flex items-center gap-3",
                          !student && "student-slot-empty justify-center cursor-pointer"
                        )}
                        onClick={() => student ? handleStudentClick(student, room.id) : handleAddStudentToRoom(room.id)}
                      >
                        {student ? (
                          <>
                            <img
                              src={student.photoUrl}
                              alt={student.name}
                              className="w-10 h-10 rounded-full bg-secondary"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{student.name}</p>
                              <p className="text-xs text-muted-foreground truncate">
                                {student.department || "No department"}
                              </p>
                            </div>
                          </>
                        ) : isSupervisor ? (
                          <div className="flex items-center gap-2 py-1 text-primary/70">
                            <UserPlus className="w-4 h-4" />
                            <span className="text-sm">Add Student</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 py-1 text-muted-foreground/50">
                            <span className="text-sm">Empty Slot</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Student Profile Dialog */}
      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Student Profile</DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-6">
              {/* Profile Header */}
              <div className="flex items-center gap-4">
                <img
                  src={selectedStudent.photoUrl}
                  alt={selectedStudent.name}
                  className="w-20 h-20 rounded-full bg-secondary"
                />
                <div>
                  <h3 className="text-xl font-bold">{selectedStudent.name}</h3>
                  <p className="text-muted-foreground">{selectedStudent.department || "No department"}</p>
                  {selectedStudent.batch && <Badge className="mt-2">Batch {selectedStudent.batch}</Badge>}
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                  <MapPin className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">District</p>
                    <p className="font-medium">{selectedStudent.district || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                  <Droplet className="w-5 h-5 text-destructive" />
                  <div>
                    <p className="text-xs text-muted-foreground">Blood Group</p>
                    <p className="font-medium">{selectedStudent.bloodGroup || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                  <Calendar className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Date of Birth</p>
                    <p className="font-medium">{selectedStudent.dob ? new Date(selectedStudent.dob).toLocaleDateString() : "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                  <GraduationCap className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Entry Date</p>
                    <p className="font-medium">{selectedStudent.entryDate ? new Date(selectedStudent.entryDate).toLocaleDateString() : "N/A"}</p>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                  <Phone className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="font-medium">{selectedStudent.phone || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                  <Mail className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="font-medium">{selectedStudent.email || "N/A"}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              {canEditStudent && (
                <div className="flex gap-3 pt-2">
                  <Button className="flex-1 gap-2" onClick={handleEditClick}>
                    <Edit className="w-4 h-4" />
                    Edit Profile
                  </Button>
                  {isSupervisor && (
                    <Button variant="destructive" className="gap-2 admin-only" onClick={handleDeleteStudent}>
                      <Trash2 className="w-4 h-4" />
                      Remove
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modals */}
      <AddRoomModal
        open={isAddRoomOpen}
        onOpenChange={setIsAddRoomOpen}
        onAddRoom={addRoom}
        floors={floors}
        preselectedFloorId={floorNumber}
      />
      <AddStudentModal
        open={isAddStudentOpen}
        onOpenChange={setIsAddStudentOpen}
        onAddStudent={addStudent}
        floors={floors}
        preselectedFloorId={floorNumber}
        preselectedRoomId={addStudentRoomId}
      />
      <EditStudentModal
        open={isEditStudentOpen}
        onOpenChange={setIsEditStudentOpen}
        student={selectedStudent}
        currentFloorId={floorNumber}
        currentRoomId={selectedRoomId || 0}
        floors={floors}
        onUpdateStudent={handleUpdateStudent}
      />
      <AccessDeniedModal
        isOpen={showAccessDenied}
        onClose={() => setShowAccessDenied(false)}
      />
    </div>
  );
}
