import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Building2, 
  ChevronRight, 
  Users, 
  DoorOpen,
  Plus,
  Eye,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useHallData, Block } from "@/hooks/useHallData";
import { AddFloorModal } from "@/components/modals/AddFloorModal";
import { AddRoomModal } from "@/components/modals/AddRoomModal";
import { AddStudentModal } from "@/components/modals/AddStudentModal";
import { AddBlockModal } from "@/components/modals/AddBlockModal";
import { EditBlockModal } from "@/components/modals/EditBlockModal";
import { BlockSelector } from "@/components/blocks/BlockSelector";
import { useAuth } from "@/contexts/AuthContext";
import { AccessDeniedModal } from "@/components/auth/AccessDeniedModal";
import { toast } from "sonner";

export default function Floors() {
  const { 
    floors, 
    blocks,
    addFloor, 
    addRoom, 
    addStudent, 
    getFloorStats,
    addBlock,
    updateBlock,
    deleteBlock,
    getFloorsByBlock,
    getBlockStats,
    deleteFloor,
  } = useHallData();
  const { isSupervisor, isAuthenticated } = useAuth();
  const [isAddFloorOpen, setIsAddFloorOpen] = useState(false);
  const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isAddBlockOpen, setIsAddBlockOpen] = useState(false);
  const [isEditBlockOpen, setIsEditBlockOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState<Block | null>(null);
  const [showAccessDenied, setShowAccessDenied] = useState(false);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  // Set default selected block
  useEffect(() => {
    if (blocks.length > 0 && !selectedBlockId) {
      setSelectedBlockId(blocks[0].id);
    }
  }, [blocks, selectedBlockId]);

  const handleAdminAction = (action: () => void) => {
    if (isSupervisor) {
      action();
    } else {
      setShowAccessDenied(true);
    }
  };

  const handleEditBlock = (block: Block) => {
    setEditingBlock(block);
    setIsEditBlockOpen(true);
  };

  const handleDeleteBlock = (blockId: string) => {
    const success = deleteBlock(blockId);
    if (!success) {
      toast.error("Cannot delete block with active floors. Please remove all floors first.");
    } else {
      toast.success("Block deleted successfully");
      // Select first remaining block
      if (blocks.length > 1) {
        const remaining = blocks.find(b => b.id !== blockId);
        if (remaining) setSelectedBlockId(remaining.id);
      }
    }
  };

  const handleAddFloor = (floorName: string) => {
    if (selectedBlockId) {
      addFloor(floorName, selectedBlockId);
    }
  };

  // Filter floors by selected block
  const filteredFloors = selectedBlockId 
    ? getFloorsByBlock(selectedBlockId)
    : floors;

  const blockStats = selectedBlockId ? getBlockStats(selectedBlockId) : null;

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
            <span className="text-foreground">Floors</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Floor Management</h1>
              <p className="text-muted-foreground">
                View and manage all floors in the hall
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {isSupervisor && (
                <>
                  <Button variant="outline" className="gap-2 admin-only" onClick={() => handleAdminAction(() => setIsAddStudentOpen(true))}>
                    <Users className="w-4 h-4" />
                    Add Student
                  </Button>
                  <Button variant="outline" className="gap-2 admin-only" onClick={() => handleAdminAction(() => setIsAddRoomOpen(true))}>
                    <DoorOpen className="w-4 h-4" />
                    Add Room
                  </Button>
                  <Button className="glow-button gap-2 admin-only" onClick={() => handleAdminAction(() => setIsAddFloorOpen(true))}>
                    <Plus className="w-4 h-4" />
                    Add Floor
                  </Button>
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* Block Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <BlockSelector
            blocks={blocks}
            selectedBlockId={selectedBlockId}
            onSelectBlock={setSelectedBlockId}
            onAddBlock={isSupervisor ? () => handleAdminAction(() => setIsAddBlockOpen(true)) : undefined}
            onEditBlock={isSupervisor ? handleEditBlock : undefined}
            onDeleteBlock={isSupervisor ? handleDeleteBlock : undefined}
            isSupervisor={isSupervisor}
          />
        </motion.div>

        {/* Floor Cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedBlockId}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="grid md:grid-cols-2 gap-6 mb-8"
          >
            {filteredFloors.map((floor, index) => {
              const stats = getFloorStats(floor.id);
              return (
                <motion.div
                  key={floor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card-hover p-6 rounded-2xl"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">{floor.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Floor {floor.id}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link to={`/floors/${floor.id}`}>
                        <Button variant="outline" size="sm" className="gap-1">
                          <Eye className="w-4 h-4" />
                          View Rooms
                        </Button>
                      </Link>
                      {isSupervisor && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => {
                            const success = deleteFloor(floor.id);
                            if (success) {
                              toast.success(`${floor.name} has been deleted.`);
                            } else {
                              toast.error("Cannot delete floor with students. Remove students first.");
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="p-3 rounded-lg bg-secondary/50">
                      <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                        <DoorOpen className="w-4 h-4" />
                        Rooms
                      </div>
                      <div className="text-2xl font-bold">
                        {stats.occupiedRooms}
                        <span className="text-muted-foreground text-base font-normal">
                          /{stats.totalRooms}
                        </span>
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-secondary/50">
                      <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                        <Users className="w-4 h-4" />
                        Students
                      </div>
                      <div className="text-2xl font-bold">
                        {stats.currentOccupancy}
                        <span className="text-muted-foreground text-base font-normal">
                          /{stats.totalCapacity}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Occupancy Progress */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Occupancy Rate</span>
                      <span className="font-medium">
                        {stats.totalCapacity > 0 ? Math.round((stats.currentOccupancy / stats.totalCapacity) * 100) : 0}%
                      </span>
                    </div>
                    <Progress 
                      value={stats.totalCapacity > 0 ? (stats.currentOccupancy / stats.totalCapacity) * 100 : 0} 
                      className="h-2"
                    />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {filteredFloors.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-12 rounded-2xl text-center mb-8"
          >
            <Building2 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No floors in this block</h3>
            <p className="text-muted-foreground">
              {isSupervisor ? "Add a floor to get started" : "No floors have been added yet"}
            </p>
          </motion.div>
        )}

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6 rounded-2xl"
        >
          <h3 className="text-lg font-semibold mb-4">
            {selectedBlockId ? `Block ${blocks.find(b => b.id === selectedBlockId)?.name} Overview` : "Hall Overview"}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-xl bg-secondary/50">
              <div className="text-3xl font-bold text-primary mb-1">
                {blockStats ? blockStats.totalFloors : floors.length}
              </div>
              <div className="text-sm text-muted-foreground">Total Floors</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-secondary/50">
              <div className="text-3xl font-bold text-primary mb-1">
                {blockStats ? blockStats.totalRooms : floors.reduce((acc, f) => acc + f.rooms.length, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Rooms</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-secondary/50">
              <div className="text-3xl font-bold text-primary mb-1">
                {blockStats ? blockStats.currentOccupancy : floors.reduce((acc, f) => acc + f.rooms.reduce((a, r) => a + r.students.length, 0), 0)}
              </div>
              <div className="text-sm text-muted-foreground">Current Students</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-secondary/50">
              <div className="text-3xl font-bold text-success mb-1">
                {blockStats 
                  ? blockStats.totalCapacity - blockStats.currentOccupancy
                  : floors.reduce((acc, f) => acc + f.rooms.length * 4, 0) - floors.reduce((acc, f) => acc + f.rooms.reduce((a, r) => a + r.students.length, 0), 0)}
              </div>
              <div className="text-sm text-muted-foreground">Available Slots</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Modals */}
      <AddFloorModal
        open={isAddFloorOpen}
        onOpenChange={setIsAddFloorOpen}
        onAddFloor={handleAddFloor}
        nextFloorNumber={Math.max(...floors.map(f => f.id), 0) + 1}
      />
      <AddRoomModal
        open={isAddRoomOpen}
        onOpenChange={setIsAddRoomOpen}
        onAddRoom={addRoom}
        floors={filteredFloors}
      />
      <AddStudentModal
        open={isAddStudentOpen}
        onOpenChange={setIsAddStudentOpen}
        onAddStudent={addStudent}
        floors={filteredFloors}
      />
      <AddBlockModal
        open={isAddBlockOpen}
        onOpenChange={setIsAddBlockOpen}
        onAddBlock={addBlock}
      />
      <EditBlockModal
        open={isEditBlockOpen}
        onOpenChange={setIsEditBlockOpen}
        block={editingBlock}
        onUpdateBlock={updateBlock}
      />
      <AccessDeniedModal
        isOpen={showAccessDenied}
        onClose={() => setShowAccessDenied(false)}
      />
    </div>
  );
}
