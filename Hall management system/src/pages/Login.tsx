import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  Building2,
  Loader2,
  GraduationCap,
  Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>("student");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login, isAuthenticated } = useAuth();

  // Redirect if already logged in
  if (isAuthenticated) {
    navigate("/");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password, selectedRole);
      
      if (success) {
        toast({
          title: "Login Successful",
          description: `Welcome back${selectedRole === "supervisor" ? ", Supervisor" : ""}!`,
        });
        navigate("/");
      }
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-hall-blue-light/10 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <div className="glass-card p-8 rounded-3xl">
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="p-2 rounded-lg bg-primary/10">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
              <span className="font-bold text-xl text-gradient">HallHub</span>
            </Link>
            <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
            <p className="text-muted-foreground">
              Sign in to access your account
            </p>
          </div>

          {/* Role Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-3">
              Login As
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedRole("student")}
                className={cn(
                  "p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2",
                  selectedRole === "student"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:border-primary/50 hover:bg-secondary/50"
                )}
              >
                <GraduationCap className="w-6 h-6" />
                <span className="font-medium text-sm">Student</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole("supervisor")}
                className={cn(
                  "p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2",
                  selectedRole === "supervisor"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:border-primary/50 hover:bg-secondary/50"
                )}
              >
                <Shield className="w-6 h-6" />
                <span className="font-medium text-sm">Supervisor</span>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="pl-10 h-12 bg-secondary border-0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="pl-10 pr-10 h-12 bg-secondary border-0"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-border" />
                <span className="text-muted-foreground">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-primary hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 text-base glow-button"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground mt-6 space-y-2">
            <p>
              Don't have an account?{" "}
              <Link to="/register" className="text-primary font-medium hover:underline">
                Register as Student
              </Link>
            </p>
            <p>
              Are you a hall supervisor?{" "}
              <Link to="/supervisor-register" className="text-primary font-medium hover:underline">
                Register as Supervisor
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
