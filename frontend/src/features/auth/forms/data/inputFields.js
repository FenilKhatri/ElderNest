import { Mail, Phone, UserCircle } from "lucide-react";

export const fields = [
    {
        name: "name",
        id: "name",
        label: "name",
        labelName: "Name",
        icon: UserCircle,
        placeholder: "Enter your name...",
        type: "text",
    },
    {
        name: "email",
        id: "email",
        label: "email",
        labelName: "Email",
        icon: Mail,
        placeholder: "Enter your email...",
        type: "email",
    },
    {
        name: "phone",
        id: "phone",
        label: "phone",
        labelName: "Phone",
        icon: Phone,
        placeholder: "Enter your phone...",
        type: "tel",
    },
];