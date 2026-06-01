import { useState, useRef, useEffect } from "react";
import { Search, X, SlidersHorizontal, ChevronDown, Check } from "lucide-react";

/**
 * Premium search + filter bar for admin/list pages.
 * filters: [{ key, label, value, onChange, options: [{value, label}], placeholder?, searchable? }]
 */
const SearchFilterBar = ({
  search = "",
  onSearchChange,
  searchPlaceholder = "Search...",
  filters = [],
  onClear,
  className = "",
}) => {
  const hasActive =
    search.trim() ||
    filters.some((f) => f.value && f.value !== "" && f.value !== "all");

  const activeCount = filters.filter(
    (f) => f.value && f.value !== "" && f.value !== "all"
  ).length;

  return (
    <div
      className={`relative rounded-2xl border border-slate-200/80 dark:border-slate-700/60 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow duration-300 ${className}`}
    >
      <div className="flex flex-col lg:flex-row items-stretch gap-0">
        {/* Search Field */}
        <div className="relative flex-1 group">
          <Search className="w-[18px] h-[18px] absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors duration-200" />
          <input
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-11 pr-10 py-3.5 bg-transparent text-slate-900 dark:text-slate-100 text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none border-0 focus:ring-0"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-150"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Divider */}
        {filters.length > 0 && (
          <div className="hidden lg:block w-px bg-slate-200 dark:bg-slate-700/60 my-2" />
        )}

        {/* Filters */}
        {filters.length > 0 && (
          <div className="flex items-center gap-2 px-3 py-2 lg:py-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1 px-2 py-1.5 text-slate-500 dark:text-slate-400">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="text-xs font-medium hidden sm:inline">Filters</span>
              {activeCount > 0 && (
                <span className="ml-1 w-5 h-5 rounded-full bg-blue-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {activeCount}
                </span>
              )}
            </div>

            {filters.map((f) => (
              <FilterDropdown
                key={f.key}
                label={f.label}
                options={f.options}
                value={f.value}
                onChange={f.onChange}
                placeholder={f.placeholder || "All"}
                searchable={f.searchable}
              />
            ))}

            {hasActive && onClear && (
              <button
                type="button"
                onClick={onClear}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
              >
                <X className="w-3.5 h-3.5" />
                Clear all
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Inline filter dropdown — opens a floating panel with options.
 */
const FilterDropdown = ({
  label,
  options = [],
  value,
  onChange,
  placeholder = "All",
  searchable = false,
}) => {
  const [open, setOpen] = useState(false);
  const [filterSearch, setFilterSearch] = useState("");
  const ref = useRef(null);

  const selectedLabel =
    options.find((o) => o.value === value)?.label || placeholder;
  const isActive = value && value !== "" && value !== "all";

  const filtered = searchable && filterSearch.trim()
    ? options.filter((o) =>
        o.label.toLowerCase().includes(filterSearch.toLowerCase())
      )
    : options;

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        setFilterSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 border
          ${
            isActive
              ? "bg-blue-50 dark:bg-blue-900/25 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
              : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
          }`}
      >
        <span className="text-slate-400 dark:text-slate-500 font-normal">
          {label}:
        </span>
        <span className="max-w-[100px] truncate">{selectedLabel}</span>
        <ChevronDown
          className={`w-3 h-3 shrink-0 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute right-0 lg:left-0 mt-2 w-52 z-50 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-slate-900/60 overflow-hidden animate-in fade-in-0 slide-in-from-top-1 duration-200">
          {searchable && (
            <div className="p-2 border-b border-slate-100 dark:border-slate-700">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={filterSearch}
                  onChange={(e) => setFilterSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-md border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Search..."
                  onClick={(e) => e.stopPropagation()}
                  autoFocus
                />
              </div>
            </div>
          )}

          <ul className="max-h-52 overflow-y-auto p-1">
            {filtered.length === 0 ? (
              <li className="px-3 py-2.5 text-xs text-slate-500 text-center">
                No options found
              </li>
            ) : (
              filtered.map((opt) => {
                const selected = value === opt.value;
                return (
                  <li key={opt.value}>
                    <button
                      type="button"
                      onClick={() => {
                        onChange(opt.value);
                        setOpen(false);
                        setFilterSearch("");
                      }}
                      className={`w-full px-3 py-2 rounded-lg text-xs text-left flex items-center justify-between transition-colors duration-150
                        ${
                          selected
                            ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium"
                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                        }`}
                    >
                      <span>{opt.label}</span>
                      {selected && (
                        <Check className="w-3.5 h-3.5 text-blue-500" />
                      )}
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchFilterBar;
