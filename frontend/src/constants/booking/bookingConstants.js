import { Clock, FileText, UserCheck, Briefcase } from "lucide-react";

export const DEFAULT_SLOT_DURATION = 60;

export const bookingSteps = [
    {
      title: "Wait for Approval",
      description: "Our admin team is reviewing your initial registration details.",
      icon: Clock,
      status: "current",
    },
    {
      title: "Complete Verification",
      description: "Submit necessary identity and qualification documents securely.",
      icon: FileText,
      status: "upcoming",
    },
    {
      title: "Admin Final Review",
      description: "We verify your uploaded documents for compliance.",
      icon: UserCheck,
      status: "upcoming",
    },
    {
      title: "Start Working",
      description: "Set up your public profile and start receiving care bookings!",
      icon: Briefcase,
      status: "upcoming",
    }
  ];