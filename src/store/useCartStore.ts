import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

export interface ActivityLogItem {
  id: string;
  type: "add" | "remove";
  itemTitle: string;
  itemImage: string;
  date: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  activityLog: ActivityLogItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      activityLog: [],

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);
          const logEntry: ActivityLogItem = {
            id: Date.now().toString(),
            type: "add",
            itemTitle: item.title,
            itemImage: item.image,
            date: new Date().toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            }),
          };

          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
              ),
              activityLog: [logEntry, ...state.activityLog].slice(0, 20),
            };
          }
          return {
            items: [...state.items, { ...item, quantity: 1 }],
            activityLog: [logEntry, ...state.activityLog].slice(0, 20),
          };
        }),

      removeItem: (id) =>
        set((state) => {
          const item = state.items.find((i) => i.id === id);
          if (!item) return state;

          const logEntry: ActivityLogItem = {
            id: Date.now().toString(),
            type: "remove",
            itemTitle: item.title,
            itemImage: item.image,
            date: new Date().toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            }),
          };

          return {
            items: state.items.filter((i) => i.id !== id),
            activityLog: [logEntry, ...state.activityLog].slice(0, 20),
          };
        }),

      updateQuantity: (id, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.id !== id)
              : state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        })),

      clearCart: () => set({ items: [] }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
    }),
    {
      name: "void-cart-storage",
      partialize: (state) => ({
        items: state.items,
        activityLog: state.activityLog,
      }),
    },
  ),
);
