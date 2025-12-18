import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { verifyPassword } from "@/lib/passwordValidation";

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
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Get registered users from localStorage
    const students = JSON.parse(localStorage.getItem("hallhub_students") || "[]");
    const supervisors = JSON.parse(localStorage.getItem("hallhub_supervisors") || "[]");

    let foundUser = null;

    if (role === "student") {
      foundUser = students.find((s: any) => s.email === email);
    } else if (role === "supervisor") {
      foundUser = supervisors.find((s: any) => s.email === email);
    }

    // If no user found, deny login
    if (!foundUser) {
      return false;
    }

    // Verify password against stored hash
    const isPasswordValid = await verifyPassword(password, foundUser.password);
    
    if (!isPasswordValid) {
      return false;
    }

    // Create authenticated user object (without password)
    const authenticatedUser: User = {
      id: foundUser.id,
      email: foundUser.email,
      name: foundUser.name || foundUser.fullName || email.split("@")[0],
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
