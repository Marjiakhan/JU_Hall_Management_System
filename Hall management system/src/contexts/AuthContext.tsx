import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type UserRole = "student" | "supervisor" | null;

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  isSupervisor: boolean;
  isStudent: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const MOCK_USERS = {
  student: {
    email: "student@hallhub.com",
    password: "student123",
    id: "STU001",
    name: "John Student",
    role: "student" as UserRole,
  },
  supervisor: {
    email: "supervisor@hallhub.com",
    password: "supervisor123",
    id: "SUP001",
    name: "Admin Supervisor",
    role: "supervisor" as UserRole,
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Load user from localStorage on mount
    const savedUser = localStorage.getItem("hallhub_user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
      } catch {
        localStorage.removeItem("hallhub_user");
        localStorage.removeItem("hallhub_role");
      }
    }
  }, []);

  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock authentication - in production, this would be a real API call
    const mockUser = role === "supervisor" ? MOCK_USERS.supervisor : MOCK_USERS.student;
    
    // For demo purposes, accept any email/password with the correct role selected
    // In production, verify against backend
    const authenticatedUser: User = {
      id: mockUser.id,
      email: email,
      name: role === "supervisor" ? "Hall Supervisor" : email.split("@")[0],
      role: role,
    };

    setUser(authenticatedUser);
    localStorage.setItem("hallhub_user", JSON.stringify(authenticatedUser));
    localStorage.setItem("hallhub_role", role || "");
    
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("hallhub_user");
    localStorage.removeItem("hallhub_role");
  };

  const value: AuthContextType = {
    user,
    role: user?.role || null,
    isAuthenticated: !!user,
    login,
    logout,
    isSupervisor: user?.role === "supervisor",
    isStudent: user?.role === "student",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
