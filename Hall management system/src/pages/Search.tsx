import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Search as SearchIcon, 
  ChevronRight,
  Filter,
  User,
  Building2,
  GraduationCap,
  MapPin,
  X
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data for all students
const allStudents = [
  { id: "1", name: "Ahmed Rahman", department: "Computer Science", batch: "2022", district: "Dhaka", room: "101", floor: 1, photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed" },
  { id: "2", name: "Karim Hossain", department: "Electrical Engineering", batch: "2022", district: "Chittagong", room: "101", floor: 1, photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Karim" },
  { id: "3", name: "Rafiq Islam", department: "Mechanical Engineering", batch: "2021", district: "Sylhet", room: "101", floor: 1, photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rafiq" },
  { id: "4", name: "Tariq Ahmed", department: "Civil Engineering", batch: "2023", district: "Rajshahi", room: "102", floor: 1, photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tariq" },
  { id: "5", name: "Salam Khan", department: "Computer Science", batch: "2021", district: "Khulna", room: "201", floor: 2, photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Salam" },
  { id: "6", name: "Nasir Uddin", department: "Architecture", batch: "2022", district: "Barishal", room: "202", floor: 2, photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nasir" },
  { id: "7", name: "Harun Rashid", department: "Electrical Engineering", batch: "2023", district: "Dhaka", room: "203", floor: 2, photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Harun" },
  { id: "8", name: "Jamal Haque", department: "Pharmacy", batch: "2022", district: "Comilla", room: "204", floor: 2, photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jamal" },
];

const departments = ["All Departments", "Computer Science", "Electrical Engineering", "Mechanical Engineering", "Civil Engineering", "Architecture", "Pharmacy"];
const districts = ["All Districts", "Dhaka", "Chittagong", "Sylhet", "Rajshahi", "Khulna", "Barishal", "Comilla"];

export default function Search() {
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("All Departments");
  const [district, setDistrict] = useState("All Districts");
  const [showFilters, setShowFilters] = useState(false);

  const filteredStudents = useMemo(() => {
    return allStudents.filter((student) => {
      const matchesQuery =
        query === "" ||
        student.name.toLowerCase().includes(query.toLowerCase()) ||
        student.room.includes(query) ||
        student.department.toLowerCase().includes(query.toLowerCase());

      const matchesDepartment =
        department === "All Departments" || student.department === department;

      const matchesDistrict =
        district === "All Districts" || student.district === district;

      return matchesQuery && matchesDepartment && matchesDistrict;
    });
  }, [query, department, district]);

  const clearFilters = () => {
    setQuery("");
    setDepartment("All Departments");
    setDistrict("All Districts");
  };

  const hasActiveFilters = query || department !== "All Departments" || district !== "All Districts";

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
            <span className="text-foreground">Search</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Search Students</h1>
          <p className="text-muted-foreground">
            Find students by name, room number, department, or district
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-4 rounded-2xl mb-6"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, room, or department..."
                className="pl-10 h-12 bg-secondary border-0 text-base"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2 h-12"
            >
              <Filter className="w-4 h-4" />
              Filters
              {hasActiveFilters && (
                <Badge className="ml-1 bg-primary text-primary-foreground">Active</Badge>
              )}
            </Button>
          </div>

          {/* Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-4 grid md:grid-cols-3 gap-4">
                  <Select value={department} onValueChange={setDepartment}>
                    <SelectTrigger className="h-12 bg-secondary border-0">
                      <GraduationCap className="w-4 h-4 mr-2 text-muted-foreground" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={district} onValueChange={setDistrict}>
                    <SelectTrigger className="h-12 bg-secondary border-0">
                      <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {districts.map((dist) => (
                        <SelectItem key={dist} value={dist}>{dist}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button
                    variant="ghost"
                    onClick={clearFilters}
                    className="h-12 gap-2"
                    disabled={!hasActiveFilters}
                  >
                    <X className="w-4 h-4" />
                    Clear Filters
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Results */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-muted-foreground">
              Found <span className="text-foreground font-medium">{filteredStudents.length}</span> students
            </p>
          </div>

          {filteredStudents.length === 0 ? (
            <div className="glass-card p-12 rounded-2xl text-center">
              <User className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No students found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria or filters
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence mode="popLayout">
                {filteredStudents.map((student, index) => (
                  <motion.div
                    key={student.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    className="glass-card-hover p-4 rounded-2xl"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={student.photoUrl}
                        alt={student.name}
                        className="w-14 h-14 rounded-full bg-secondary"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{student.name}</h3>
                        <p className="text-sm text-muted-foreground truncate">
                          {student.department}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Badge variant="outline" className="gap-1">
                        <Building2 className="w-3 h-3" />
                        Room {student.room}
                      </Badge>
                      <Badge variant="outline" className="gap-1">
                        <MapPin className="w-3 h-3" />
                        {student.district}
                      </Badge>
                      <Badge variant="secondary">
                        Batch {student.batch}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
