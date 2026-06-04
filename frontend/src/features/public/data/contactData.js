import { Mail, MessageCircleCheck, Phone } from "lucide-react";
import { CONTACT_INFO } from "../../../constants/ui/contactInfo";

export const contactItems = [
    {
        icon: Phone,
        name: "Contact",
        title: "24/7 Toll-Free Helpline",
        description: "Available for immediate booking and emergency support.",
        value: CONTACT_INFO.PHONE_FORMATTED,
        href: `tel:${CONTACT_INFO.PHONE.replace(/\s+/g, '')}`,
        style: "bg-blue-100 text-blue-700",
    },
    {
        icon: MessageCircleCheck,
        title: "WhatsApp Support",
        name: "Whatsapp",
        description: "Chat with our care coordinators instantly.",
        value: CONTACT_INFO.PHONE_FORMATTED,
        href: `https://wa.me/${CONTACT_INFO.WHATSAPP}`,
        style: "bg-emerald-100 text-emerald-700",
    },
    {
        icon: Mail,
        title: "Email Support",
        name: "Email",
        description: "Send us your questions and care requirements anytime.",
        value: CONTACT_INFO.EMAIL,
        href: `mailto:${CONTACT_INFO.EMAIL}`,
        style: "bg-red-100 text-red-700",
    },
];