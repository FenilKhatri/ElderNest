import { Mail, MessageCircleCheck, Phone } from "lucide-react";

export const contactItems = [
    {
        icon: Phone,
        name: "Contact",
        title: "24/7 Toll-Free Helpline",
        description: "Available for immediate booking and emergency support.",
        value: "+91 93134 07400",
        href: "tel:+919313407400",
        style: "bg-blue-100 text-blue-700",
    },
    {
        icon: MessageCircleCheck,
        title: "WhatsApp Support",
        name: "Whatsapp",
        description: "Chat with our care coordinators instantly.",
        value: "+91 93134 07400",
        href: "https://wa.me/919313407400",
        style: "bg-emerald-100 text-emerald-700",
    },
    {
        icon: Mail,
        title: "Email Support",
        name: "Email",
        description: "Send us your questions and care requirements anytime.",
        value: "fenilkhatri931@gmail.com",
        href: "mailto:fenilkhatri931@gmail.com",
        style: "bg-red-100 text-red-700",
    },
];