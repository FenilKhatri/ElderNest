import { BookOpen, Cpu, Database, Mail, Share2, UserStar } from "lucide-react";

const privacyData = [
    {
        id: "Introduction",
        number: "01",
        title: "Introduction",
        icon: BookOpen,
        theme: "text-blue-500",
        content: [
            {
                type: "paragraph",
                text: `Welcome to ElderNest. This Privacy Policy describes how ElderNest Technologies Inc. ("ElderNest", "we", "us", or "our") collects, uses, shares, and protects your personal information when you use our website, mobile applications, and healthcare matching services (collectively, the "Services").`
            },
            {
                type: "paragraph",
                text: "By accessing or using our Services, you agree to the terms of this Privacy Policy. If you do not agree with our practices, please do not use our Services."
            },
        ],
    },
    {
        id: "Information Collection",
        number: "02",
        title: "Information We Collect",
        icon: Database,
        theme: "text-purple-500",
        content: [
            {
                type: "paragraph",
                text: "We collect information that you provide directly to us, information generated automatically when you use our Services, and information from third-party sources (such as background check providers for caregivers)."
            },
            {
                type: "subsection",
                text: "Information You Provide to Us"
            },
            {
                type: "list",
                items: [
                    "Account Information: Name, email address, phone number, password, and physical address.",
                    "Health & Care Needs: Information regarding the medical conditions, daily assistance requirements, and preferences for the individual receiving care.",
                    "Payment Information: Credit card details, billing address, and transaction history (processed securely via our third-party payment processors like Stripe).",
                    "Communications: Messages sent through our platform between families and caregivers, as well as interactions with our support and AI voice assistant."
                ]
            }, ,
            {
                type: "subsection",
                text: "Information Collected Automatically"
            },
            {
                type: "list",
                items: [
                    "Device & Usage Data: IP addresses, browser types, device identifiers, and details about how you interact with our platform.",
                    "Device & Usage Data: IP addresses, browser types, device identifiers, and details about how you interact with our platform.",
                ]
            }
        ],
    },
    {
        id: "How We Use Information",
        number: "03",
        title: "How We Use Your Information",
        icon: Cpu,
        theme: "text-cyan-500",
        content: [
            {
                type: "paragraph",
                text: "We use the information we collect to deliver, maintain, and improve our intelligent healthcare matching platform. Specifically, we use your data to:"
            },
            {
                type: "list",
                items: [
                    "Facilitate the matching of patients with verified healthcare professionals using our AI algorithms.",
                    "Process transactions and send related information, including confirmations and invoices.",
                    "Send technical notices, updates, security alerts, and support messages.",
                    "Respond to your comments, questions, and requests through our customer service.",
                    "Train and improve our AI voice assistant to better understand and serve user needs (voice data is anonymized where possible).",
                    "Monitor and analyze trends, usage, and activities to optimize our platform's performance.",
                ]
            }
        ],
    },
    {
        id: "Data Sharing & Disclosure",
        number: "04",
        title: "Data Sharing & Disclosure",
        icon: Share2,
        theme: "text-emerald-500",
        content: [
            {
                type: "paragraph",
                text: "We do not sell your personal information. We only share your data in the following circumstances:"
            },
            {
                type: "list",
                items: [
                    "With Caregivers: We share necessary care requirements, address, and contact information with the caregivers you book or interact with.",
                    "With Service Providers: We engage third-party companies to perform services on our behalf, such as payment processing, background checks, and cloud hosting. These providers have limited access to your data and are bound by strict confidentiality agreements.",
                    "With Service Providers: We engage third-party companies to perform services on our behalf, such as payment processing, background checks, and cloud hosting. These providers have limited access to your data and are bound by strict confidentiality agreements.",
                ]
            }
        ],
    },
    {
        id: "Data Security",
        number: "05",
        title: "Data Security",
        icon: Lock,
        theme: "text-yellow-500",
        content: [
            {
                type: "paragraph",
                text: "We implement industry-standard security measures designed to protect your personal and health-related information from unauthorized access, destruction, use, modification, or disclosure."
            },
            {
                type: "paragraph",
                text: "Our platform utilizes end-to-end encryption for sensitive data, secure socket layer (SSL) technology for transmissions, and robust access controls. However, no internet-based service can be 100% secure, and we cannot guarantee absolute security of your information."
            },
        ],
    },
    {
        id: "Your Rights & Choices",
        number: "06",
        title: "Your Rights & Choices",
        icon: UserStar,
        theme: "text-blue-500",
        content: [
            {
                type: "paragraph",
                text: "Depending on your location, you may have certain rights regarding your personal information:"
            },
            {
                type: "list",
                items: [
                    "Access & Portability: You can request a copy of the personal data we hold about you.",
                    "Correction: You can update or correct inaccuracies in your profile directly through your account settings.",
                    "Deletion: You can request the deletion of your account and personal data, subject to certain legal obligations we must retain.",
                    "Opt-Out: You can opt out of receiving promotional communications from us by following the instructions in those messages.",
                ]
            }
        ],
    },
    {
        id: "Contact Us",
        number: "07",
        title: "Contact Us",
        icon: Mail,
        theme: "text-purple-500",
        content: [
            {
                type: "paragraph",
                text: "If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact our Data Protection Officer at:"
            }, {
                type: "contact",
                items: [
                    { label: "Email", value: "fenilkhatri931@gmail.com" },
                    { label: "Phone", value: "+91 93134 07400" }
                ]
            }
        ],
    },
]

export default privacyData;