import { Mail, MessageCircleCheck, Phone } from "lucide-react";

const contactItems = [
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
    name: "Watsapp",
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

const GetInTouch = () => {
  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-2xl font-bold text-slate-900 dark:text-white text-center leading-tight tracking-tight">
        Get in Touch Directly
      </h3>

      <div className="flex items-center md:items-start justify-center md:justify-start gap-5">
        {contactItems.map((item, index) => {
          const Icon = item.icon;

          return (
            <div className="flex flex-col items-center gap-3">
              <div
                className={`h-12 w-12 rounded-full flex items-center justify-center ${item.style}`}
                key={index}
              >
                <a
                  className={`font-bold text-lg ${item.style}`}
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                  title={item.name}
                >
                  <Icon className="h-5 w-5" />
                </a>
              </div>
              <p className="text-slate-500 font-semibold">{item.name}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GetInTouch;
