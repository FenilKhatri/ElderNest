import { Mail, Phone, UserCircle, Lock } from "lucide-react";

export const basicFields = [
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

export const passwordFields = [
    {
        name: "password",
        id: "password",
        label: "password",
        labelName: "Password",
        icon: Lock,
        placeholder: "Enter your password...",
        type: "password",
        isPassword: true,
    },
    {
        name: "confirmPassword",
        id: "confirmPassword",
        label: "confirmPassword",
        labelName: "Confirm Password",
        icon: Lock,
        placeholder: "Enter your confirm password...",
        type: "password",
        isPassword: true,
    },
];

export const loginFields = [
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
        ...passwordFields[0],
    },
];

// Register
export const registerFields = [...basicFields, ...passwordFields];

// Caregiver register
export const caregiverRegisterFields = registerFields;