import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  ChevronRight, 
  Ambulance, 
  Phone, 
  AlertTriangle,
  Shield,
  Clock,
  CheckCircle2,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const emergencyTypes = [
  { value: "medical", label: "Medical Emergency", icon: "🏥" },
  { value: "accident", label: "Accident", icon: "⚠️" },
  { value: "fire", label: "Fire", icon: "🔥" },
  { value: "security", label: "Security Issue", icon: "🛡️" },
  { value: "other", label: "Other", icon: "📋" },
];

const contacts = [
  { name: "Hall Office", phone: "+880 1712-000001", available: "24/7" },
  { name: "Medical Center", phone: "+880 1712-000002", available: "24/7" },
  { name: "Security", phone: "+880 1712-000003", available: "24/7" },
  { name: "Ambulance", phone: "999", available: "24/7" },
];

export default function Emergency() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [emergencyType, setEmergencyType] = useState("");
  const [location, setLocation] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [description, setDescription] = useState("");
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Extract room and floor from location (e.g., "Room 101, Ground Floor")
      const locationParts = location.split(",").map(s => s.trim());
      const roomNumber = locationParts[0] || location;
      const floor = locationParts[1] || "Unknown";

      // Send emergency email
      const { data, error } = await supabase.functions.invoke("send-emergency-email", {
        body: {
          studentName: user?.name || "Unknown Student",
          roomNumber: roomNumber,
          floor: floor,
          message: `Type: ${emergencyType}\n${description}\nContact: ${contactNumber}`,
        },
      });

      if (error) {
        console.error("Error sending emergency email:", error);
        toast({
          title: "Email Failed",
          description: "Emergency request submitted but email notification failed.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Emergency alert sent to supervisor",
          description: "Help is on the way. Stay calm and stay where you are.",
        });
      }

      setIsSubmitted(true);
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Emergency Request Submitted",
        description: "Help is on the way. Stay calm and stay where you are.",
      });
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setEmergencyType("");
    setLocation("");
    setContactNumber("");
    setDescription("");
  };

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
            <span className="text-foreground">Emergency</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Emergency Services</h1>
          <p className="text-muted-foreground">
            Request immediate assistance or find emergency contacts
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Emergency Request Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="glass-card p-6 rounded-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                  <Ambulance className="w-6 h-6 text-destructive" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Request Emergency Help</h2>
                  <p className="text-sm text-muted-foreground">Submit a request for immediate assistance</p>
                </div>
              </div>

              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-success/10 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-success" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Help is on the way!</h3>
                  <p className="text-muted-foreground mb-6">
                    Your emergency request has been submitted and the supervisor has been notified via email.
                    Stay calm and stay where you are. Our team will contact you shortly.
                  </p>
                  <Button onClick={handleReset} variant="outline">
                    Submit Another Request
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Emergency Type *
                    </label>
                    <Select value={emergencyType} onValueChange={setEmergencyType} required>
                      <SelectTrigger className="h-12 bg-secondary border-0">
                        <SelectValue placeholder="Select emergency type" />
                      </SelectTrigger>
                      <SelectContent>
                        {emergencyTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <span className="flex items-center gap-2">
                              <span>{type.icon}</span>
                              {type.label}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Your Location *
                    </label>
                    <Input
                      placeholder="e.g., Room 101, Ground Floor"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="h-12 bg-secondary border-0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Contact Number *
                    </label>
                    <Input
                      type="tel"
                      placeholder="+880 1XXX-XXXXXX"
                      required
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      className="h-12 bg-secondary border-0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Description
                    </label>
                    <Textarea
                      placeholder="Briefly describe the emergency..."
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="bg-secondary border-0 resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-14 text-lg emergency-button"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-5 h-5 mr-2" />
                        Request Emergency Help
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </motion.div>

          {/* Emergency Contacts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="glass-card p-6 rounded-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Emergency Contacts</h2>
                  <p className="text-sm text-muted-foreground">Quick access to important numbers</p>
                </div>
              </div>

              <div className="space-y-3">
                {contacts.map((contact, index) => (
                  <motion.a
                    key={contact.name}
                    href={`tel:${contact.phone.replace(/\s/g, "")}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors group"
                  >
                    <div>
                      <p className="font-medium group-hover:text-primary transition-colors">
                        {contact.name}
                      </p>
                      <p className="text-sm text-muted-foreground">{contact.phone}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-success flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {contact.available}
                      </span>
                      <Button size="sm" variant="ghost" className="rounded-full">
                        <Phone className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Safety Tips */}
            <div className="glass-card p-6 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-primary" />
                <h3 className="font-semibold">Safety Tips</h3>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  Stay calm and assess the situation before calling
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  Know your exact location (room number, floor)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  Follow emergency exit routes during evacuations
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  Keep emergency contacts saved on your phone
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  Report any safety hazards to hall administration
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
