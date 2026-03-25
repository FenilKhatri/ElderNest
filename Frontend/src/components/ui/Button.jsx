const variants = {
  primary: "bg-[#2A7DE1] text-white hover:bg-[#1f6cc4] cursor-pointer",
  secondary:
    "bg-[#FF3366]/30 text-[#FF3366] hover:bg-[#FF3366]/10 dark:border-[#ff6b8f] dark:text-[#ff6b8f] dark:hover:bg-[#FF3366]/20 cursor-pointer transition duration-300 dark:bg-transparent dark:border",
  outline:
    "border border-slate-300 text-slate-800 hover:bg-[#2A7DE1] hover:border-[#2A7DE1] hover:text-white cursor-pointer",
  ghost: "text-slate-600 hover:bg-slate-100 cursor-pointer",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) => {
  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2
        rounded-md font-semibold
        transition duration-200
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
