import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SearchState {
  recentSearches: string[];
  addSearch: (query: string) => void;
  removeSearch: (query: string) => void;
  clearSearches: () => void;
}

export const useSearchStore = create<SearchState>()(
  persist(
    (set) => ({
      recentSearches: [],
      addSearch: (query) =>
        set((state) => {
          const filtered = state.recentSearches.filter(
            (q) => q.toLowerCase() !== query.toLowerCase()
          );
          return { recentSearches: [query, ...filtered].slice(0, 5) };
        }),
      removeSearch: (query) =>
        set((state) => ({
          recentSearches: state.recentSearches.filter((q) => q !== query),
        })),
      clearSearches: () => set({ recentSearches: [] }),
    }),
    {
      name: "void-search-history",
    }
  )
);