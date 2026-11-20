import { create } from "zustand";
import { Product } from "../types";
import { MOCK_PRODUCTS } from "../constants/mockData";

interface StockState {
  products: Product[];
  activeTab: "crops" | "warehouse";
  setActiveTab: (tab: "crops" | "warehouse") => void;
  updateStock: (productId: string, newQuantity: number) => void;
  addProduct: (product: Omit<Product, "id">) => void;
  deleteProduct: (productId: string) => void;
}

export const useStockStore = create<StockState>((set) => ({
  products: MOCK_PRODUCTS,
  activeTab: "crops",

  setActiveTab: (tab) => set({ activeTab: tab }),

  updateStock: (productId, newQuantity) => {
    set((state) => ({
      products: state.products.map((p) =>
        p.id === productId
          ? {
              ...p,
              quantity: Math.max(0, newQuantity),
              status: newQuantity === 0 ? "UNAVAILABLE" : newQuantity < 30 ? "LIMITED" : "AVAILABLE",
            }
          : p
      ),
    }));
  },

  addProduct: (productData) => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
    };
    set((state) => ({
      products: [newProduct, ...state.products],
    }));
  },

  deleteProduct: (productId) => {
    set((state) => ({
      products: state.products.filter((p) => p.id !== productId),
    }));
  },
}));
