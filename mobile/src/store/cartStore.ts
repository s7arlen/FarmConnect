import { create } from "zustand";
import { Product } from "../types";

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
  getTotalItems: () => number;
  getTotalAmount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [
    // Pre-populate with 1 demo item for immediate UI preview
    {
      product: {
        id: "prod-1",
        farmerId: "farmer-1",
        name: "Fresh Hybrid Tomatoes",
        category: "vegetables",
        price: 32,
        quantity: 140,
        unit: "kg",
        status: "AVAILABLE",
        farmName: "Joseph's Agro Farm",
        image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&q=80",
      },
      quantity: 5,
    },
  ],

  addItem: (product, quantity = 1) => {
    set((state) => {
      const existing = state.items.find((i) => i.product.id === product.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.product.id === product.id
              ? { ...i, quantity: Math.min(i.quantity + quantity, product.quantity) }
              : i
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
      items: state.items.filter((i) => i.product.id !== productId),
    }));
  },

  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId);
      return;
    }
    set((state) => ({
      items: state.items.map((i) =>
        i.product.id === productId ? { ...i, quantity } : i
      ),
    }));
  },

  clearCart: () => set({ items: [] }),

  getTotalItems: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },

  getTotalAmount: () => {
    return get().items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  },
}));
