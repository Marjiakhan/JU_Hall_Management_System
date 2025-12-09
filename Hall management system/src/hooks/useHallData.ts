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
}

export interface Room {
  id: number;
  students: Student[];
}

export interface Floor {
  id: number;
  name: string;
  rooms: Room[];
}

interface HallData {
  floors: Floor[];
}

const STORAGE_KEY = "hallManagementData";

// Initial mock data
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
      phone: "+880 1712-345678",
      email: "ahmed.rahman@student.edu",
      photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed",
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
      phone: "+880 1812-456789",
      email: "karim.hossain@student.edu",
      photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Karim",
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
      phone: "+880 1912-567890",
      email: "rafiq.islam@student.edu",
      photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rafiq",
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
      phone: "+880 1612-678901",
      email: "tariq.ahmed@student.edu",
      photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tariq",
    },
  ];

  return {
    floors: [
      {
        id: 1,
        name: "Ground Floor",
        rooms: [
          { id: 101, students: [mockStudents[0], mockStudents[1], mockStudents[2]] },
          { id: 102, students: [mockStudents[3]] },
          ...Array.from({ length: 38 }, (_, i) => ({ id: 103 + i, students: [] })),
        ],
      },
      {
        id: 2,
        name: "First Floor",
        rooms: Array.from({ length: 40 }, (_, i) => ({ id: 201 + i, students: [] })),
      },
    ],
  };
};

const loadFromStorage = (): HallData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
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

  const addFloor = useCallback((floorName: string) => {
    setData((prev) => {
      const newFloorId = Math.max(...prev.floors.map((f) => f.id), 0) + 1;
      const newFloor: Floor = {
        id: newFloorId,
        name: floorName || `Floor ${newFloorId}`,
        rooms: [],
      };
      return { floors: [...prev.floors, newFloor] };
    });
  }, []);

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
      return { floors };
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
        return { floors };
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
      return { floors };
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

        return { floors };
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

  return {
    floors: data.floors,
    addFloor,
    addRoom,
    addStudent,
    deleteStudent,
    updateStudent,
    getFloorStats,
  };
}
