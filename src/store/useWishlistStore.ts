import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";

export interface WishlistItem {
  id: number | string;
  title: string;
  price: number | string;
  image: string;
}

interface WishlistStore {
  items: WishlistItem[];
  toggleItem: (item: WishlistItem) => void;
  removeItem: (id: number | string) => void;
  isInWishlist: (id: number | string) => boolean;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      toggleItem: (item) => {
        const currentItems = get().items;
        const exists = currentItems.some((i) => i.id === item.id);

        if (exists) {
          set({ items: currentItems.filter((i) => i.id !== item.id) });
          toast.info(`${item.title} removed from wishlist.`);
        } else {
          set({ items: [item, ...currentItems] });
          toast.success(`${item.title} added to wishlist!`);
        }
      },
      removeItem: (id) => {
        const currentItems = get().items;
        const itemToRemove = currentItems.find((i) => i.id === id);
        if (itemToRemove) {
          set({ items: currentItems.filter((i) => i.id !== id) });
          toast.info(`${itemToRemove.title} removed from wishlist.`);
        }
      },
      isInWishlist: (id) => get().items.some((i) => i.id === id),
    }),
    {
      name: "void-loot-wishlist",
    },
  ),
);
