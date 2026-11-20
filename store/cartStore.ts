import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/types/product";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  clearFarmerItems: (farmerId: string) => void;
  getTotalItems: () => number;
  getTotalAmount: () => number;
  getItemsByFarmer: () => Record<string, CartItem[]>;
  isInCart: (productId: string) => boolean;
  getItemQuantity: (productId: string) => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1) => {
        set((state) => {
          const existing = state.items.find(
            (item) => item.product.id === product.id
          );

          if (existing) {
            const newQty = Math.min(
              existing.quantity + quantity,
              product.quantity // Never exceed available stock
            );
            return {
              items: state.items.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: newQty }
                  : item
              ),
            };
          }

          return {
            items: [...state.items, { product, quantity: Math.min(quantity, product.quantity) }],
          };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId
              ? {
                  ...item,
                  quantity: Math.min(quantity, item.product.quantity),
                }
              : item
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      clearFarmerItems: (farmerId) => {
        set((state) => ({
          items: state.items.filter(
            (item) => item.product.farmerId !== farmerId
          ),
        }));
      },

      getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getTotalAmount: () => {
        return get().items.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        );
      },

      getItemsByFarmer: () => {
        const groups: Record<string, CartItem[]> = {};
        for (const item of get().items) {
          const fid = item.product.farmerId;
          if (!groups[fid]) groups[fid] = [];
          groups[fid].push(item);
        }
        return groups;
      },

      isInCart: (productId) => {
        return get().items.some((item) => item.product.id === productId);
      },

      getItemQuantity: (productId) => {
        return (
          get().items.find((item) => item.product.id === productId)?.quantity ||
          0
        );
      },
    }),
    {
      name: "farmconnect-cart",
    }
  )
);
