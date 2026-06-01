const Checkbox = ({
  label,
  checked,
  onChange,
  disabled = false,
  className = "",
  id,
  description,
}) => {
  const inputId = id || `cb-${label?.replace(/\s/g, "-")}`;

  return (
    <label
      htmlFor={inputId}
      className={`inline-flex items-start gap-3 cursor-pointer select-none ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
    >
      <span className="relative flex shrink-0 mt-0.5">
        <input
          id={inputId}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={onChange}
          className="peer sr-only"
        />
        <span
          className="w-5 h-5 rounded-md border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800
            peer-checked:bg-blue-600 peer-checked:border-blue-600
            peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500 peer-focus-visible:ring-offset-2
            dark:peer-focus-visible:ring-offset-slate-900 transition-colors flex items-center justify-center"
          aria-hidden
        >
          {checked && (
            <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
              <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </span>
      </span>
      {(label || description) && (
        <span>
          {label && <span className="text-sm font-medium text-slate-700 dark:text-slate-300 block">{label}</span>}
          {description && <span className="text-xs text-slate-500 dark:text-slate-400 block mt-0.5">{description}</span>}
        </span>
      )}
    </label>
  );
};

export default Checkbox;
