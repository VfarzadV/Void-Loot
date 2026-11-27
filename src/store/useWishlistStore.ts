import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface WishlistItem {
  id: number | string;
  title: string;
  price: number | string;
  image: string;
}

interface WishlistState {
  items: WishlistItem[];
  ownerId: number | null;
  toggleItem: (item: WishlistItem) => void;
  removeItem: (id: number | string) => void;
  setAccountItems: (ownerId: number, items: WishlistItem[]) => void;
  clearAccountData: () => void;
  isInWishlist: (id: number | string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      ownerId: null,
      
      toggleItem: (item) =>
        set((state) => {
          const exists = state.items.some((i) => i.id === item.id);
          if (exists) {
            return { items: state.items.filter((i) => i.id !== item.id) };
          }
          return { items: [...state.items, item] };
        }),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),

      setAccountItems: (ownerId, items) => set({ ownerId, items }),
      clearAccountData: () => set({ ownerId: null, items: [] }),

      isInWishlist: (id) => {
        return get().items.some((i) => i.id === id);
      },
    }),
    {
      name: "void-wishlist-storage",
      partialize: (state) => ({
        ownerId: state.ownerId,
        items: state.ownerId === null ? state.items : [],
      }),
    },
  ),
);