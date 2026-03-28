import React from "react";

const Input = React.forwardRef(
  ({ label, icon, rightIcon, onRightIcon, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {/* Label */}
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>

        {/* Input Wrapper */}
        <div
          className={`py-3 border rounded-xl transition-all duration-200
          ${
            error
              ? "border-red-500 ring-1 ring-red-500 focus-within:border-red-500"
              : "border-slate-200 dark:border-slate-800 focus-within:border-indigo-500"
          }
          bg-slate-50 dark:bg-[#0F172A] focus-within:bg-white dark:focus-within:bg-[#0B1120]`}
        >
          <div className="flex items-center gap-3 px-4">
            {/* Left Icon */}
            {icon && <div className="text-slate-500">{icon}</div>}

            {/* Input Field */}
            <input
              ref={ref}
              className={`w-full bg-transparent text-sm outline-none placeholder:text-slate-400
              ${error ? "text-red-500" : ""}`}
              {...props}
            />

            {/* Right Icon */}
            {rightIcon && (
              <button
                type="button"
                onClick={onRightIcon}
                className="text-slate-500 hover:text-indigo-500 transition duration-300"
              >
                {rightIcon}
              </button>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 text-xs mt-1 ml-1">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
