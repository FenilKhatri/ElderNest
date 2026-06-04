import React from "react";
import { Filter } from "lucide-react";
import Button from "./Button";

const MobileFilterToggle = ({ isOpen, onToggle, className = "" }) => {
  return (
    <div className={`flex items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 ${className}`}>
      <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
        <Filter className="w-5 h-5" /> Filters
      </span>
      <Button variant="outline" className="py-2" onClick={onToggle}>
        {isOpen ? "Hide Filters" : "Show Filters"}
      </Button>
    </div>
  );
};

export default MobileFilterToggle;
