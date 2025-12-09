import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Building2, 
  Users, 
  Shield, 
  Search, 
  Ambulance, 
  MessageCircle,
  ArrowRight,
  Sparkles,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Building2,
    title: "Room Management",
    description: "Efficiently manage floors and rooms with our intuitive interface. Track occupancy and allocations in real-time.",
  },
  {
    icon: Users,
    title: "Student Profiles",
    description: "Comprehensive student profiles with all essential information. Easy access to contact details and academic info.",
  },
  {
    icon: Search,
    title: "Smart Search",
    description: "Powerful search functionality to find students by name, room, department, or district instantly.",
  },
  {
    icon: Ambulance,
    title: "Emergency Services",
    description: "One-click emergency assistance. Request ambulance or medical help immediately when needed.",
  },
  {
    icon: Shield,
    title: "Secure Access",
    description: "Role-based access control for administrators and supervisors. Keep your data safe and organized.",
  },
  {
    icon: MessageCircle,
    title: "AI Assistant",
    description: "24/7 AI-powered chatbot to answer questions about registration, rules, and provide guidance.",
  },
];

const stats = [
  { value: "2", label: "Floors" },
  { value: "80", label: "Rooms" },
  { value: "320", label: "Capacity" },
  { value: "24/7", label: "Support" },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-hall-blue-light/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />

        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
            >
              <Sparkles className="w-4 h-4" />
              Modern Hall Management System
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-6xl font-bold mb-6"
            >
              Welcome to{" "}
              <span className="text-gradient">HallHub</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
            >
              A comprehensive digital solution for managing university hall accommodations. 
              Track rooms, manage students, handle emergencies, and more — all in one place.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/floors">
                <Button size="lg" className="glow-button text-base px-8 gap-2">
                  Explore Floors
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" variant="outline" className="text-base px-8">
                  Register Now
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
          >
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="glass-card p-6 rounded-2xl text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our system provides all the tools necessary for efficient hall management
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card-hover p-6 rounded-2xl"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-primary p-8 md:p-16 text-center"
          >
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <div className="absolute top-10 left-10 w-32 h-32 border-2 border-primary-foreground rounded-full" />
              <div className="absolute bottom-10 right-10 w-48 h-48 border-2 border-primary-foreground rounded-full" />
            </div>

            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
                Join our hall management system today and experience seamless accommodation management.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register">
                  <Button size="lg" variant="secondary" className="text-base px-8 gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Register Now
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" variant="outline" className="text-base px-8 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              <span className="font-semibold text-gradient">HallHub</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} HallHub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
