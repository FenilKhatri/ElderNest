import React from "react";

const Input = ({ icon: Icon, label, labelName, ...props }) => {
  return (
    <div className="flex flex-col w-full gap-1.5">
      {labelName && (
        <label
          htmlFor={label}
          className="text-sm font-semibold text-slate-500 ml-0.5"
        >
          {labelName}
        </label>
      )}
      <div className="flex items-center justify-start gap-3 px-4 py-2.5 bg-transperant border border-slate-300 rounded-xl shadow-sm transition-all duration-200 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/20 group">
        {Icon && (
          <Icon
            size={18}
            className="text-slate-400 transition-colors duration-200 group-focus-within:text-blue-500"
          />
        )}

        <input
          id={label}
          {...props}
          className="w-full bg-transparent text-slate-900 dark:text-slate-100 placeholder:text-slate-500 focus:outline-none text-sm md:text-base"
        />
      </div>
    </div>
  );
};

export default Input;
