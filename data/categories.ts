export const PRODUCT_CATEGORIES = [
  { id: "vegetables", label: "Vegetables", color: "#2F6B3F" },
  { id: "fruits", label: "Fruits", color: "#C94A4A" },
  { id: "grains", label: "Grains & Pulses", color: "#D79A28" },
  { id: "leafy", label: "Leafy Greens", color: "#2F6B3F" },
  { id: "roots", label: "Roots & Tubers", color: "#D79A28" },
  { id: "dairy", label: "Dairy & Eggs", color: "#F8F6EF" },
  { id: "herbs", label: "Herbs & Spices", color: "#2F6B3F" },
  { id: "other", label: "Other Produce", color: "#6B756E" },
] as const;

export type ProductCategoryId = typeof PRODUCT_CATEGORIES[number]["id"];
