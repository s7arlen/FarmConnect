import { create } from "zustand";
import { User, UserRole } from "../types";

interface AuthState {
  user: User | null;
  role: UserRole;
  token: string | null;
  setRole: (role: UserRole) => void;
  setUser: (user: User | null) => void;
  loginDemo: (role: UserRole) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: {
    id: "demo-farmer-1",
    name: "Joseph D'Souza",
    email: "joseph@demo.farmconnect.in",
    phone: "+91 94482 00001",
    role: "FARMER",
    avatar: "https://images.unsplash.com/photo-1592507736547-20dedbef9b32?w=400&q=80",
  },
  role: "FARMER",
  token: "demo-jwt-token",

  setRole: (role) => set((state) => ({
    role,
    user: state.user ? { ...state.user, role } : null,
  })),

  setUser: (user) => set({ user, role: user?.role || "BUYER" }),

  loginDemo: (role) => {
    const demoAccounts: Record<UserRole, User> = {
      FARMER: {
        id: "demo-farmer-1",
        name: "Joseph D'Souza",
        email: "farmer@demo.com",
        phone: "+91 94482 00001",
        role: "FARMER",
        avatar: "https://images.unsplash.com/photo-1592507736547-20dedbef9b32?w=400&q=80",
      },
      BUYER: {
        id: "demo-buyer-1",
        name: "Rahul Sharma",
        email: "buyer@demo.com",
        phone: "+91 98765 43210",
        role: "BUYER",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
      },
      BULK_BUYER: {
        id: "demo-bulk-1",
        name: "Grand Heritage Resort",
        email: "bulk@demo.com",
        phone: "+91 98888 12345",
        role: "BULK_BUYER",
      },
      ADMIN: {
        id: "demo-admin-1",
        name: "Platform Admin",
        email: "admin@demo.com",
        role: "ADMIN",
      },
    };

    set({
      user: demoAccounts[role],
      role,
      token: `demo-token-${role}`,
    });
  },

  logout: () => set({ user: null, role: "BUYER", token: null }),
}));
