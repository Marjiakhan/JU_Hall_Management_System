import { useState, useEffect, useCallback } from "react";

export interface Student {
  id: string;
  name: string;
  department: string;
  batch: string;
  district: string;
  entryDate: string;
  dob: string;
  bloodGroup: string;
  phone: string;
  email: string;
  photoUrl: string;
  status: "regular" | "irregular"; // New field for Regular/Irregular status
}

export interface Room {
  id: number;
  students: Student[];
}

export interface Floor {
  id: number;
  name: string;
  rooms: Room[];
  blockId: string; // Added for block management
}

export interface Block {
  id: string;
  name: string;
  description?: string;
}

interface HallData {
  floors: Floor[];
  blocks: Block[];
}

const STORAGE_KEY = "hallManagementData";

// Initial mock data with blocks
const getInitialData = (): HallData => {
  const mockStudents: Student[] = [
    {
      id: "S001",
      name: "Ahmed Rahman",
      department: "Computer Science",
      batch: "2022",
      district: "Dhaka",
      entryDate: "2022-09-01",
      dob: "2001-05-15",
      bloodGroup: "A+",
      phone: "01712345678",
      email: "ahmed.rahman@student.edu",
      photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed",
      status: "regular",
    },
    {
      id: "S002",
      name: "Karim Hossain",
      department: "Electrical Engineering",
      batch: "2022",
      district: "Chittagong",
      entryDate: "2022-09-01",
      dob: "2001-08-22",
      bloodGroup: "B+",
      phone: "01812456789",
      email: "karim.hossain@student.edu",
      photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Karim",
      status: "regular",
    },
    {
      id: "S003",
      name: "Rafiq Islam",
      department: "Mechanical Engineering",
      batch: "2021",
      district: "Sylhet",
      entryDate: "2021-09-01",
      dob: "2000-12-10",
      bloodGroup: "O+",
      phone: "01912567890",
      email: "rafiq.islam@student.edu",
      photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rafiq",
      status: "irregular",
    },
    {
      id: "S004",
      name: "Tariq Ahmed",
      department: "Civil Engineering",
      batch: "2023",
      district: "Rajshahi",
      entryDate: "2023-09-01",
      dob: "2002-03-25",
      bloodGroup: "AB+",
      phone: "01612678901",
      email: "tariq.ahmed@student.edu",
      photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tariq",
      status: "regular",
    },
  ];

  const defaultBlocks: Block[] = [
    { id: "block-a", name: "A", description: "Main Building" },
    { id: "block-b", name: "B", description: "Annex Building" },
  ];

  return {
    blocks: defaultBlocks,
    floors: [
      {
        id: 1,
        name: "Ground Floor",
        blockId: "block-a",
        rooms: [
          { id: 101, students: [mockStudents[0], mockStudents[1], mockStudents[2]] },
          { id: 102, students: [mockStudents[3]] },
          ...Array.from({ length: 38 }, (_, i) => ({ id: 103 + i, students: [] })),
        ],
      },
      {
        id: 2,
        name: "First Floor",
        blockId: "block-a",
        rooms: Array.from({ length: 40 }, (_, i) => ({ id: 201 + i, students: [] })),
      },
    ],
  };
};

const loadFromStorage = (): HallData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Migration: Add blocks if not present (non-breaking)
      if (!parsed.blocks) {
        parsed.blocks = [
          { id: "block-a", name: "A", description: "Main Building" },
          { id: "block-b", name: "B", description: "Annex Building" },
        ];
      }
      // Migration: Add blockId to floors if not present
      if (parsed.floors && parsed.floors.length > 0 && !parsed.floors[0].blockId) {
        parsed.floors = parsed.floors.map((floor: Floor) => ({
          ...floor,
          blockId: "block-a", // Default to Block A for existing data
        }));
      }
      return parsed;
    }
  } catch (error) {
    console.error("Error loading from localStorage:", error);
  }
  return getInitialData();
};

const saveToStorage = (data: HallData) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
};

export function useHallData() {
  const [data, setData] = useState<HallData>(loadFromStorage);

  useEffect(() => {
    saveToStorage(data);
  }, [data]);

  // Block management functions
  const addBlock = useCallback((name: string, description?: string) => {
    setData((prev) => {
      const newBlock: Block = {
        id: `block-${Date.now()}`,
        name,
        description,
      };
      return { ...prev, blocks: [...prev.blocks, newBlock] };
    });
  }, []);

  const updateBlock = useCallback((blockId: string, name: string, description?: string) => {
    setData((prev) => {
      const blocks = prev.blocks.map((block) =>
        block.id === blockId ? { ...block, name, description } : block
      );
      return { ...prev, blocks };
    });
  }, []);

  const deleteBlock = useCallback((blockId: string): boolean => {
    const floorsInBlock = data.floors.filter((f) => f.blockId === blockId);
    if (floorsInBlock.length > 0) {
      return false; // Cannot delete block with floors
    }
    setData((prev) => ({
      ...prev,
      blocks: prev.blocks.filter((b) => b.id !== blockId),
    }));
    return true;
  }, [data.floors]);

  const getFloorsByBlock = useCallback((blockId: string) => {
    return data.floors.filter((f) => f.blockId === blockId);
  }, [data.floors]);

  const getBlockById = useCallback((blockId: string) => {
    return data.blocks.find((b) => b.id === blockId);
  }, [data.blocks]);

  const addFloor = useCallback((floorName: string, blockId?: string) => {
    setData((prev) => {
      const targetBlockId = blockId || prev.blocks[0]?.id || "block-a";
      const newFloorId = Math.max(...prev.floors.map((f) => f.id), 0) + 1;
      const newFloor: Floor = {
        id: newFloorId,
        name: floorName || `Floor ${newFloorId}`,
        rooms: [],
        blockId: targetBlockId,
      };
      return { ...prev, floors: [...prev.floors, newFloor] };
    });
  }, []);

  // Delete floor (supervisor only) - only if no students in any room
  const deleteFloor = useCallback((floorId: number): boolean => {
    const floor = data.floors.find((f) => f.id === floorId);
    if (!floor) return false;
    
    // Check if any room has students
    const hasStudents = floor.rooms.some((room) => room.students.length > 0);
    if (hasStudents) {
      return false; // Cannot delete floor with students
    }

    setData((prev) => ({
      ...prev,
      floors: prev.floors.filter((f) => f.id !== floorId),
    }));
    return true;
  }, [data.floors]);

  // Delete room (supervisor only) - only if no students
  const deleteRoom = useCallback((floorId: number, roomId: number): boolean => {
    const floor = data.floors.find((f) => f.id === floorId);
    if (!floor) return false;
    
    const room = floor.rooms.find((r) => r.id === roomId);
    if (!room) return false;
    
    // Check if room has students
    if (room.students.length > 0) {
      return false; // Cannot delete room with students
    }

    setData((prev) => ({
      ...prev,
      floors: prev.floors.map((f) => {
        if (f.id === floorId) {
          return {
            ...f,
            rooms: f.rooms.filter((r) => r.id !== roomId),
          };
        }
        return f;
      }),
    }));
    return true;
  }, [data.floors]);

  const addRoom = useCallback((floorId: number, roomNumber: number) => {
    setData((prev) => {
      const floors = prev.floors.map((floor) => {
        if (floor.id === floorId) {
          // Check if room number already exists
          if (floor.rooms.some((r) => r.id === roomNumber)) {
            return floor;
          }
          return {
            ...floor,
            rooms: [...floor.rooms, { id: roomNumber, students: [] }],
          };
        }
        return floor;
      });
      return { ...prev, floors };
    });
  }, []);

  const addStudent = useCallback(
    (floorId: number, roomId: number, studentData: Omit<Student, "id" | "photoUrl">) => {
      setData((prev) => {
        const floors = prev.floors.map((floor) => {
          if (floor.id === floorId) {
            const rooms = floor.rooms.map((room) => {
              if (room.id === roomId) {
                // Max 4 students per room
                if (room.students.length >= 4) {
                  return room;
                }
                const newStudent: Student = {
                  ...studentData,
                  id: `S${Date.now()}`,
                  photoUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${studentData.name.replace(/\s/g, "")}`,
                };
                return { ...room, students: [...room.students, newStudent] };
              }
              return room;
            });
            return { ...floor, rooms };
          }
          return floor;
        });
        return { ...prev, floors };
      });
    },
    []
  );

  const deleteStudent = useCallback((floorId: number, roomId: number, studentId: string) => {
    setData((prev) => {
      const floors = prev.floors.map((floor) => {
        if (floor.id === floorId) {
          const rooms = floor.rooms.map((room) => {
            if (room.id === roomId) {
              return {
                ...room,
                students: room.students.filter((s) => s.id !== studentId),
              };
            }
            return room;
          });
          return { ...floor, rooms };
        }
        return floor;
      });
      return { ...prev, floors };
    });
  }, []);

  const updateStudent = useCallback(
    (
      oldFloorId: number,
      oldRoomId: number,
      studentId: string,
      updatedData: Partial<Student>,
      newFloorId?: number,
      newRoomId?: number
    ) => {
      setData((prev) => {
        let studentToMove: Student | null = null;

        // First, find and possibly remove the student from old location
        let floors = prev.floors.map((floor) => {
          if (floor.id === oldFloorId) {
            const rooms = floor.rooms.map((room) => {
              if (room.id === oldRoomId) {
                const studentIndex = room.students.findIndex((s) => s.id === studentId);
                if (studentIndex !== -1) {
                  // Update or remove the student
                  if (newFloorId !== undefined && newRoomId !== undefined) {
                    // Moving to different room - remove from current
                    studentToMove = { ...room.students[studentIndex], ...updatedData };
                    return {
                      ...room,
                      students: room.students.filter((s) => s.id !== studentId),
                    };
                  } else {
                    // Same room - just update
                    const updatedStudents = [...room.students];
                    updatedStudents[studentIndex] = {
                      ...updatedStudents[studentIndex],
                      ...updatedData,
                    };
                    return { ...room, students: updatedStudents };
                  }
                }
              }
              return room;
            });
            return { ...floor, rooms };
          }
          return floor;
        });

        // If moving to a new room, add to the new location
        if (studentToMove && newFloorId !== undefined && newRoomId !== undefined) {
          floors = floors.map((floor) => {
            if (floor.id === newFloorId) {
              const rooms = floor.rooms.map((room) => {
                if (room.id === newRoomId && room.students.length < 4) {
                  return {
                    ...room,
                    students: [...room.students, studentToMove!],
                  };
                }
                return room;
              });
              return { ...floor, rooms };
            }
            return floor;
          });
        }

        return { ...prev, floors };
      });
    },
    []
  );

  const getFloorStats = useCallback((floorId: number) => {
    const floor = data.floors.find((f) => f.id === floorId);
    if (!floor) return { totalRooms: 0, occupiedRooms: 0, totalCapacity: 0, currentOccupancy: 0 };
    
    const totalRooms = floor.rooms.length;
    const occupiedRooms = floor.rooms.filter((r) => r.students.length > 0).length;
    const totalCapacity = totalRooms * 4;
    const currentOccupancy = floor.rooms.reduce((acc, r) => acc + r.students.length, 0);
    
    return { totalRooms, occupiedRooms, totalCapacity, currentOccupancy };
  }, [data]);

  const getBlockStats = useCallback((blockId: string) => {
    const blockFloors = data.floors.filter((f) => f.blockId === blockId);
    const totalFloors = blockFloors.length;
    const totalRooms = blockFloors.reduce((acc, f) => acc + f.rooms.length, 0);
    const totalCapacity = totalRooms * 4;
    const currentOccupancy = blockFloors.reduce(
      (acc, f) => acc + f.rooms.reduce((a, r) => a + r.students.length, 0),
      0
    );
    return { totalFloors, totalRooms, totalCapacity, currentOccupancy };
  }, [data.floors]);

  return {
    floors: data.floors,
    blocks: data.blocks,
    addFloor,
    deleteFloor,
    addRoom,
    deleteRoom,
    addStudent,
    deleteStudent,
    updateStudent,
    getFloorStats,
    // Block management
    addBlock,
    updateBlock,
    deleteBlock,
    getFloorsByBlock,
    getBlockById,
    getBlockStats,
  };
}
