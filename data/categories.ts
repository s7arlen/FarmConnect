export const PRODUCT_CATEGORIES = [
  { id: "vegetables", label: "Vegetables", icon: "🥦", color: "#2F6B3F" },
  { id: "fruits", label: "Fruits", icon: "🍎", color: "#C94A4A" },
  { id: "grains", label: "Grains & Pulses", icon: "🌾", color: "#D79A28" },
  { id: "leafy", label: "Leafy Greens", icon: "🥬", color: "#2F6B3F" },
  { id: "roots", label: "Roots & Tubers", icon: "🥕", color: "#D79A28" },
  { id: "dairy", label: "Dairy & Eggs", icon: "🥛", color: "#F8F6EF" },
  { id: "herbs", label: "Herbs & Spices", icon: "🌿", color: "#2F6B3F" },
  { id: "other", label: "Other Produce", icon: "🌱", color: "#6B756E" },
] as const;

export type ProductCategoryId = typeof PRODUCT_CATEGORIES[number]["id"];
