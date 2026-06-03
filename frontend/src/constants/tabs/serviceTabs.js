import { SERVICE_CATEGORIES } from "../options/serviceOptions";

export const SERVICE_FILTER_TABS = [
  { id: "all", label: "All Services" },
  ...SERVICE_CATEGORIES.map((c) => ({ id: c.value, label: c.label })),
];

