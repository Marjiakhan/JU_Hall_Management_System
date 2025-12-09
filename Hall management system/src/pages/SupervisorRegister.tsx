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
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export default function SupervisorRegister() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    hallName: "",
    password: "",
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate registration - save to localStorage for mock
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Store supervisor in localStorage
    const supervisors = JSON.parse(localStorage.getItem("hallhub_supervisors") || "[]");
    const newSupervisor = {
      id: `SUP${Date.now()}`,
      ...formData,
      role: "supervisor",
      createdAt: new Date().toISOString(),
    };
    supervisors.push(newSupervisor);
    localStorage.setItem("hallhub_supervisors", JSON.stringify(supervisors));

    setIsLoading(false);
    toast({
      title: "Registration Successful",
      description: "Your supervisor account has been created. You can now login.",
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
            <div className="flex items-center justify-center gap-2 mb-2">
              <Shield className="w-6 h-6 text-primary" />
              <h1 className="text-2xl font-bold">Supervisor Registration</h1>
            </div>
            <p className="text-muted-foreground">
              Register as a Hall Supervisor
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="John Doe"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="pl-10 h-12 bg-secondary border-0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="supervisor@hallhub.com"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10 h-12 bg-secondary border-0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="tel"
                  placeholder="+880 1XXX-XXXXXX"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="pl-10 h-12 bg-secondary border-0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Hall Name</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Shaheed Ziaur Rahman Hall"
                  required
                  value={formData.hallName}
                  onChange={(e) => setFormData({ ...formData, hallName: e.target.value })}
                  className="pl-10 h-12 bg-secondary border-0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-10 pr-10 h-12 bg-secondary border-0"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <input type="checkbox" required className="mt-1 rounded border-border" />
              <span className="text-sm text-muted-foreground">
                I confirm that I am authorized to register as a Hall Supervisor and agree to the{" "}
                <Link to="/terms" className="text-primary hover:underline">
                  Terms of Service
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
                <>
                  <Shield className="w-5 h-5 mr-2" />
                  Register as Supervisor
                </>
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground mt-6 space-y-2">
            <p>
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-medium hover:underline">
                Sign in
              </Link>
            </p>
            <p>
              Are you a student?{" "}
              <Link to="/register" className="text-primary font-medium hover:underline">
                Register as Student
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
