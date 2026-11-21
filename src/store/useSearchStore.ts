"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface SearchProductItem {
  ProductID: number;
  Title: string;
  Price: string | number;
  Stock?: number;
  Category: string;
  ImageUrl: string | null;
  Description?: string | null;
  Metacritic?: number | null;
  ReleaseYear?: string | null;
  Genre?: string | null;
}

interface SearchState {
  query: string;
  results: SearchProductItem[];
  isLoading: boolean;
  isOpen: boolean;
  setQuery: (q: string) => void;
  setIsOpen: (open: boolean) => void;
  clearSearch: () => void;
  searchProducts: (q: string) => Promise<void>;
  recentSearches: string[];
  addSearch: (term: string) => void;
  removeSearch: (term: string) => void;
  clearSearches: () => void;
}

let searchTimeout: ReturnType<typeof setTimeout> | null = null;

export const useSearchStore = create<SearchState>()(
  persist(
    (set, get) => ({
      query: "",
      results: [],
      isLoading: false,
      isOpen: false,

      setQuery: (q: string) => {
        set({ query: q, isOpen: q.trim().length > 0 });

        if (searchTimeout) {
          clearTimeout(searchTimeout);
        }

        const trimmed = q.trim();
        if (!trimmed) {
          set({ results: [], isLoading: false });
          return;
        }

        set({ isLoading: true });
        searchTimeout = setTimeout(async () => {
          try {
            const res = await fetch(
              `/api/search?q=${encodeURIComponent(trimmed)}&limit=6`,
            );
            if (!res.ok) throw new Error("Search failed");
            const data = await res.json();
            set({
              results: Array.isArray(data.results) ? data.results : [],
              isLoading: false,
            });
          } catch {
            set({ results: [], isLoading: false });
          }
        }, 250);
      },

      setIsOpen: (open: boolean) => set({ isOpen: open }),

      clearSearch: () => {
        if (searchTimeout) {
          clearTimeout(searchTimeout);
        }
        set({ query: "", results: [], isLoading: false, isOpen: false });
      },

      searchProducts: async (q: string) => {
        const trimmed = q.trim();
        if (!trimmed) {
          set({ results: [], isLoading: false });
          return;
        }
        set({ isLoading: true, isOpen: true });
        try {
          const res = await fetch(
            `/api/search?q=${encodeURIComponent(trimmed)}&limit=6`,
          );
          if (!res.ok) throw new Error("Search failed");
          const data = await res.json();
          set({
            results: Array.isArray(data.results) ? data.results : [],
            isLoading: false,
          });
        } catch {
          set({ results: [], isLoading: false });
        }
      },
      recentSearches: [],

      addSearch: (term: string) => {
        const trimmed = term.trim();
        if (!trimmed) return;
        const current = get().recentSearches;
        const filtered = current.filter(
          (s) => s.toLowerCase() !== trimmed.toLowerCase(),
        );
        set({ recentSearches: [trimmed, ...filtered].slice(0, 5) });
      },

      removeSearch: (term: string) => {
        set({
          recentSearches: get().recentSearches.filter(
            (s) => s.toLowerCase() !== term.toLowerCase(),
          ),
        });
      },

      clearSearches: () => set({ recentSearches: [] }),
    }),
    {
      name: "voidloot-search-storage",
      partialize: (state) => ({ recentSearches: state.recentSearches }),
    },
  ),
);
