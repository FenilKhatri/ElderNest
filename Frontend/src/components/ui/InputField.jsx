const Input = ({ label, icon, placeholder, type = "text" }) => {
  return (
    <>
      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </label>
      <div className="py-3 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus-within:bg-white dark:focus-within:bg-[#0B1120] focus-within:border-indigo-500 rounded-xl transition-all duration-200">
        <div className="flex items-center gap-3 px-4">
          <div className="text-slate-500">{icon}</div>

          <input
            type={type}
            placeholder={placeholder}
            className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
        </div>
      </div>
    </>
  );
};

export default Input;
