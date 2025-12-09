import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { 
  User,
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  Building2,
  Loader2,
  Phone,
  GraduationCap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const departments = [
  "Computer Science",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Architecture",
  "Pharmacy",
];

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate registration
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsLoading(false);
    toast({
      title: "Registration Successful",
      description: "Your account has been created. You can now login.",
    });
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-hall-blue-light/10 rounded-full blur-3xl" />

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
            <h1 className="text-2xl font-bold mb-2">Create Account</h1>
            <p className="text-muted-foreground">
              Register to get started with HallHub
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  First Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="John"
                    required
                    className="pl-10 h-12 bg-secondary border-0"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Last Name
                </label>
                <Input
                  placeholder="Doe"
                  required
                  className="h-12 bg-secondary border-0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="pl-10 h-12 bg-secondary border-0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="tel"
                  placeholder="+880 1XXX-XXXXXX"
                  required
                  className="pl-10 h-12 bg-secondary border-0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Department
              </label>
              <Select required>
                <SelectTrigger className="h-12 bg-secondary border-0">
                  <GraduationCap className="w-5 h-5 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
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

            <div className="flex items-start gap-2">
              <input type="checkbox" required className="mt-1 rounded border-border" />
              <span className="text-sm text-muted-foreground">
                I agree to the{" "}
                <Link to="/terms" className="text-primary hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </span>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 text-base glow-button"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
