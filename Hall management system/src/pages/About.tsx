import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  ChevronRight, 
  Building2, 
  Users, 
  Target, 
  Award,
  Shield,
  Heart
} from "lucide-react";

const values = [
  {
    icon: Shield,
    title: "Safety First",
    description: "We prioritize the safety and well-being of all residents with 24/7 security and emergency services.",
  },
  {
    icon: Users,
    title: "Community",
    description: "Building a supportive community where students can thrive academically and personally.",
  },
  {
    icon: Heart,
    title: "Care",
    description: "Dedicated staff committed to providing excellent service and support to all residents.",
  },
  {
    icon: Award,
    title: "Excellence",
    description: "Maintaining high standards in facilities, services, and overall living experience.",
  },
];

const stats = [
  { value: "50+", label: "Years of Service" },
  { value: "10,000+", label: "Alumni" },
  { value: "320", label: "Current Residents" },
  { value: "98%", label: "Satisfaction Rate" },
];

export default function About() {
  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">About Us</span>
          </div>
        </motion.div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Building2 className="w-4 h-4" />
            University Hall Management
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            About <span className="text-gradient">HallHub</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            HallHub is a modern hall management system designed to streamline accommodation 
            services for university students. We provide a safe, comfortable, and supportive 
            environment for students to focus on their academic journey.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
        >
          {stats.map((stat, index) => (
            <div key={stat.label} className="glass-card p-6 rounded-2xl text-center">
              <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-8 rounded-2xl"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed">
              To provide exceptional residential facilities and services that enhance 
              the academic success and personal development of our students. We strive 
              to create a welcoming environment that fosters community, safety, and 
              individual growth.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-8 rounded-2xl"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <Award className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
            <p className="text-muted-foreground leading-relaxed">
              To be the leading university hall management system, recognized for 
              innovation, student satisfaction, and community excellence. We aim to 
              set new standards in residential life through technology-driven solutions 
              and compassionate service.
            </p>
          </motion.div>
        </div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-8">Our Core Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="glass-card-hover p-6 rounded-2xl text-center"
              >
                <div className="w-12 h-12 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Facilities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="glass-card p-8 rounded-2xl"
        >
          <h2 className="text-2xl font-bold mb-6">Our Facilities</h2>
          <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
            {[
              "Well-furnished rooms with study areas",
              "24/7 Wi-Fi connectivity",
              "Common rooms with recreational facilities",
              "Dining hall with nutritious meals",
              "Reading room and library access",
              "Laundry services",
              "Regular cleaning and maintenance",
              "24/7 security and CCTV surveillance",
            ].map((facility, index) => (
              <div key={index} className="flex items-center gap-3 text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-primary" />
                {facility}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
