const Checkbox = ({
  label,
  name,
  checked,
  onChange,
  error,
  className = "",
  ...props
}) => {
  return (
    <div className={`flex items-start ${className}`}>
      <div className="flex items-center h-5">
        <input
          id={name}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="w-4 h-4 text-[#2A7DE1] bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 rounded focus:ring-2 focus:ring-[#2A7DE1] cursor-pointer"
          {...props}
        />
      </div>
      {label && (
        <div className="ml-3 text-sm">
          <label
            htmlFor={name}
            className="font-medium text-slate-700 dark:text-slate-300 cursor-pointer"
          >
            {label}
          </label>
          {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
      )}
    </div>
  );
};

export default Checkbox;
