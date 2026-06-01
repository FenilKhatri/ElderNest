import { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown, Search, X, Check } from "lucide-react";

/**
 * Custom dropdown — single or multi select, search, keyboard-friendly.
 */
const CustomDropdown = ({
  label,
  options = [],
  value,
  onChange,
  placeholder = "Select...",
  multiple = false,
  searchable = false,
  error,
  required = false,
  disabled = false,
  className = "",
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);

  const selectedValues = multiple
    ? Array.isArray(value)
      ? value
      : []
    : value
      ? [value]
      : [];

  const filtered = useMemo(() => {
    if (!searchable || !search.trim()) return options;
    const q = search.toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, search, searchable]);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggle = (optValue) => {
    if (disabled) return;
    if (multiple) {
      const next = selectedValues.includes(optValue)
        ? selectedValues.filter((v) => v !== optValue)
        : [...selectedValues, optValue];
      onChange(next);
    } else {
      onChange(optValue);
      setOpen(false);
      setSearch("");
    }
  };

  const displayLabel = () => {
    if (!selectedValues.length) return placeholder;
    if (!multiple) {
      return options.find((o) => o.value === selectedValues[0])?.label || placeholder;
    }
    return `${selectedValues.length} selected`;
  };

  return (
    <div className={`relative w-full ${className}`} ref={ref}>
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className={`w-full px-4 py-2.5 rounded-lg border text-left flex items-center justify-between gap-2 transition
          bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600
          text-slate-900 dark:text-slate-100
          focus:ring-2 focus:ring-blue-500 focus:border-transparent
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? "border-red-500" : ""}`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={selectedValues.length ? "" : "text-slate-400"}>{displayLabel()}</span>
        <ChevronDown className={`w-4 h-4 shrink-0 transition ${open ? "rotate-180" : ""}`} />
      </button>

      {multiple && selectedValues.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {selectedValues.map((v) => {
            const opt = options.find((o) => o.value === v);
            return (
              <span
                key={v}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs"
              >
                {opt?.label || v}
                <button type="button" onClick={() => toggle(v)} aria-label="Remove">
                  <X className="w-3 h-3" />
                </button>
              </span>
            );
          })}
        </div>
      )}

      {open && (
        <div
          className="absolute z-50 left-0 right-0 mt-1 max-h-60 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xl"
          role="listbox"
        >
          {searchable && (
            <div className="p-2 border-b border-slate-100 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-800">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-md border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Search..."
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          )}
          <ul className="overflow-y-auto max-h-52 p-1">
            {filtered.length === 0 ? (
              <li className="px-3 py-2 text-sm text-slate-500 text-center">No options</li>
            ) : (
              filtered.map((opt) => {
                const selected = selectedValues.includes(opt.value);
                return (
                  <li key={opt.value}>
                    <button
                      type="button"
                      onClick={() => toggle(opt.value)}
                      className={`w-full px-3 py-2 text-sm rounded-md flex items-center justify-between text-left
                        ${selected ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300" : "hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"}`}
                    >
                      {opt.label}
                      {selected && <Check className="w-4 h-4" />}
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default CustomDropdown;
