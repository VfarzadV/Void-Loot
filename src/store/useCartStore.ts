import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

export interface CartActivity {
  id: string;
  type: "add" | "remove";
  itemTitle: string;
  itemImage: string;
  date: string;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  activityLog: CartActivity[];
  toggleCart: () => void;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
}

const getFormattedDate = () => {
  return new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      activityLog: [],
      toggleCart: () => set({ isOpen: !get().isOpen }),
      addItem: (item) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((i) => i.id === item.id);
        const newLog: CartActivity = {
          id: `log-add-${Date.now()}`,
          type: "add",
          itemTitle: item.title,
          itemImage: item.image,
          date: getFormattedDate(),
        };
        if (existingItem) {
          set({
            items: currentItems.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
            ),
            isOpen: true,
            activityLog: [newLog, ...get().activityLog].slice(0, 30),
          });
        } else {
          set({
            items: [...currentItems, { ...item, quantity: 1 }],
            isOpen: true,
            activityLog: [newLog, ...get().activityLog].slice(0, 30),
          });
        }
      },

      removeItem: (id) => {
        const itemToRemove = get().items.find((i) => i.id === id);
        if (itemToRemove) {
          const newLog: CartActivity = {
            id: `log-rm-${Date.now()}`,
            type: "remove",
            itemTitle: itemToRemove.title,
            itemImage: itemToRemove.image,
            date: getFormattedDate(),
          };

          set({
            items: get().items.filter((i) => i.id !== id),
            activityLog: [newLog, ...get().activityLog].slice(0, 30),
          });
        }
      },

      updateQuantity: (id, quantity) =>
        set({
          items: get().items.map((i) =>
            i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i,
          ),
        }),

      clearCart: () => set({ items: [] }),
    }),
    {
      name: "void-loot-cart",
    },
  ),
);
