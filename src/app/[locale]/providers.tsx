"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { ThemeProvider } from "next-themes";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useCartStore, type CartItem } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import {
  useWishlistStore,
  type WishlistItem,
} from "@/store/useWishlistStore";

interface CollectionsResponse {
  cart: CartItem[];
  wishlist: WishlistItem[];
  unavailableProductIds?: number[];
  error?: string;
}

interface CollectionsPayload {
  cart: Array<{ id: number; quantity: number }>;
  wishlist: number[];
}

function collectionSignature(
  cart: CartItem[],
  wishlist: WishlistItem[],
): string {
  return JSON.stringify({
    cart: cart
      .map(({ id, quantity }) => [id, quantity])
      .sort(([left], [right]) => Number(left) - Number(right)),
    wishlist: wishlist
      .map((item) => Number(item.id))
      .sort((left, right) => left - right),
  });
}

function createCollectionsPayload(
  cart: CartItem[],
  wishlist: WishlistItem[],
): CollectionsPayload {
  return {
    cart: cart.map(({ id, quantity }) => ({ id, quantity })),
    wishlist: wishlist
      .map((item) => Number(item.id))
      .filter((id) => Number.isInteger(id) && id > 0),
  };
}

function mergeCartItems(
  accountItems: CartItem[],
  guestItems: CartItem[],
): CartItem[] {
  const merged = new Map(accountItems.map((item) => [item.id, { ...item }]));

  guestItems.forEach((item) => {
    const accountItem = merged.get(item.id);
    if (accountItem) {
      accountItem.quantity = Math.min(accountItem.quantity + item.quantity, 100);
    } else {
      merged.set(item.id, { ...item, quantity: Math.min(item.quantity, 100) });
    }
  });

  return [...merged.values()];
}

function mergeWishlistItems(
  accountItems: WishlistItem[],
  guestItems: WishlistItem[],
): WishlistItem[] {
  const merged = new Map(
    accountItems.map((item) => [Number(item.id), { ...item, id: Number(item.id) }]),
  );

  guestItems.forEach((item) => {
    const id = Number(item.id);
    if (Number.isInteger(id) && id > 0 && !merged.has(id)) {
      merged.set(id, { ...item, id });
    }
  });

  return [...merged.values()];
}

async function requestCollections(
  method: "GET" | "PUT",
  payload?: CollectionsPayload,
): Promise<CollectionsResponse> {
  const response = await fetch("/api/user/collections", {
    method,
    cache: "no-store",
    ...(payload
      ? {
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      : {}),
  });
  const result = (await response.json()) as CollectionsResponse;
  if (!response.ok) {
    throw new Error(result.error || "COLLECTIONS_FAILED");
  }
  return result;
}

function AuthInitializer() {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    let active = true;

    fetch("/api/auth/me", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Failed to load the user session");
        return response.json();
      })
      .then((data: { user: Parameters<typeof initialize>[0] }) => {
        if (active) initialize(data.user ?? null);
      })
      .catch((error: unknown) => {
        console.error("Auth initialization error:", error);
        if (active) initialize(null);
      });

    return () => {
      active = false;
    };
  }, [initialize]);

  return null;
}

function AccountCollectionsInitializer() {
  const userId = useAuthStore((state) => state.user?.id ?? null);
  const isAuthLoading = useAuthStore((state) => state.isLoading);
  const cartItems = useCartStore((state) => state.items);
  const wishlistItems = useWishlistStore((state) => state.items);
  const [readyVersion, setReadyVersion] = useState(0);
  const readyUserId = useRef<number | null>(null);
  const lastSavedSignature = useRef<string | null>(null);
  const saveQueue = useRef<Promise<void>>(Promise.resolve());
  const t = useTranslations("collectionsSync");

  useEffect(() => {
    if (isAuthLoading) return;

    readyUserId.current = null;
    lastSavedSignature.current = null;

    if (!userId) {
      const cart = useCartStore.getState();
      const wishlist = useWishlistStore.getState();
      if (cart.ownerId !== null) cart.clearAccountData();
      if (wishlist.ownerId !== null) wishlist.clearAccountData();
      return;
    }

    const cart = useCartStore.getState();
    const wishlist = useWishlistStore.getState();
    if (cart.ownerId !== null && cart.ownerId !== userId) {
      cart.clearAccountData();
    }
    if (wishlist.ownerId !== null && wishlist.ownerId !== userId) {
      wishlist.clearAccountData();
    }

    let active = true;
    const loadCollections = async () => {
      const accountCollections = await requestCollections("GET");
      if (!active) return;

      const currentCart = useCartStore.getState();
      const currentWishlist = useWishlistStore.getState();
      const guestCart =
        currentCart.ownerId === null ? currentCart.items : [];
      const guestWishlist =
        currentWishlist.ownerId === null ? currentWishlist.items : [];
      const needsMerge =
        currentCart.ownerId === null || currentWishlist.ownerId === null;

      const mergedCart = mergeCartItems(accountCollections.cart, guestCart);
      const mergedWishlist = mergeWishlistItems(
        accountCollections.wishlist,
        guestWishlist,
      );
      const collections = needsMerge
        ? await requestCollections(
            "PUT",
            createCollectionsPayload(mergedCart, mergedWishlist),
          )
        : accountCollections;
      if (!active) return;

      if (collections.unavailableProductIds?.length) {
        toast.warning(t("unavailableItems"));
      }

      lastSavedSignature.current = collectionSignature(
        collections.cart,
        collections.wishlist,
      );
      useCartStore.getState().hydrateAccountItems(userId, collections.cart);
      useWishlistStore
        .getState()
        .setAccountItems(userId, collections.wishlist);
      readyUserId.current = userId;
      setReadyVersion((version) => version + 1);
    };

    void loadCollections().catch((error: unknown) => {
      if (!active) return;
      console.error("Account collections initialization error:", error);
      toast.error(t("syncFailed"));
    });

    return () => {
      active = false;
    };
  }, [isAuthLoading, t, userId]);

  useEffect(() => {
    if (!userId || readyUserId.current !== userId) return;

    const signature = collectionSignature(cartItems, wishlistItems);
    if (signature === lastSavedSignature.current) return;

    const timer = setTimeout(() => {
      const payload = createCollectionsPayload(cartItems, wishlistItems);
      saveQueue.current = saveQueue.current
        .catch(() => undefined)
        .then(async () => {
          if (useAuthStore.getState().user?.id !== userId) return;

          const collections = await requestCollections("PUT", payload);
          if (useAuthStore.getState().user?.id !== userId) return;

          const unavailableIds = new Set(
            collections.unavailableProductIds || [],
          );
          if (unavailableIds.size) {
            toast.warning(t("unavailableItems"));
          }

          const currentCart = useCartStore.getState();
          const currentWishlist = useWishlistStore.getState();
          const currentSignature = collectionSignature(
            currentCart.items,
            currentWishlist.items,
          );
          if (currentSignature === signature) {
            useCartStore
              .getState()
              .setAccountItems(userId, collections.cart);
            useWishlistStore
              .getState()
              .setAccountItems(userId, collections.wishlist);
          } else if (unavailableIds.size) {
            currentCart.setAccountItems(
              userId,
              currentCart.items.filter((item) => !unavailableIds.has(item.id)),
            );
            currentWishlist.setAccountItems(
              userId,
              currentWishlist.items.filter(
                (item) => !unavailableIds.has(Number(item.id)),
              ),
            );
          }

          lastSavedSignature.current = collectionSignature(
            collections.cart,
            collections.wishlist,
          );
        })
        .catch((error: unknown) => {
          if (useAuthStore.getState().user?.id !== userId) return;
          console.error("Account collections save error:", error);
          toast.error(t("syncFailed"));
        });
    }, 250);

    return () => clearTimeout(timer);
  }, [cartItems, readyVersion, t, userId, wishlistItems]);

  return null;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <AuthInitializer />
        <AccountCollectionsInitializer />
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
}