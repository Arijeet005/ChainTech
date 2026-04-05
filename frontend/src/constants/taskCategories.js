export const DEFAULT_CATEGORIES = [
  "Work",
  "Personal",
  "Study",
  "Health",
  "Shopping",
  "Others"
];

export function normalizeCategory(value) {
  if (typeof value !== "string") return "";
  return value.trim().toLowerCase();
}

export function formatCategoryLabel(value) {
  const trimmed = typeof value === "string" ? value.trim() : "";
  if (!trimmed) return "Others";
  return trimmed
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function categoryTextColorClass(value) {
  const normalized = normalizeCategory(value);
  switch (normalized) {
    case "work":
      return "text-blue-400";
    case "personal":
      return "text-purple-400";
    case "study":
      return "text-emerald-400";
    case "health":
      return "text-red-400";
    case "shopping":
      return "text-yellow-400";
    case "others":
      return "text-gray-200";
    default:
      return "text-blue-400";
  }
}

