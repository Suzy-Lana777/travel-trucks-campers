// lib/store/campersStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { Camper } from "@/types/camper";
import { getCampers, type CampersQueryParams } from "@/lib/api/campersApi";

type CampersState = {
  campers: Camper[];
  page: number;
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;

  // ✅ Favorites (global + persist)
  favoriteIds: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  clearFavorites: () => void;

  loadCampers: (
    params?: CampersQueryParams,
    options?: { append?: boolean },
  ) => Promise<void>;
};

export const useCampersStore = create<CampersState>()(
  persist(
    (set, get) => ({
      campers: [],
      page: 1,
      isLoading: false,
      error: null,
      hasMore: true,

      // ✅ Favorites state
      favoriteIds: [],

      toggleFavorite: id =>
        set(state => {
          const exists = state.favoriteIds.includes(id);
          return {
            favoriteIds: exists
              ? state.favoriteIds.filter(x => x !== id)
              : [...state.favoriteIds, id],
          };
        }),

      isFavorite: id => get().favoriteIds.includes(id),

      clearFavorites: () => set({ favoriteIds: [] }),

      async loadCampers(params = {}, options = { append: false }) {
        const { append = false } = options;
        const state = get();

        set({ isLoading: true, error: null });

        try {
          const query: CampersQueryParams = {
            // якщо не передали page — рахуємо її самі
            page: params.page ?? (append ? state.page + 1 : 1),
            limit: params.limit ?? 4, // скільки карток за раз
            ...params,
          };

          const data = await getCampers(query); // { total, items }

          const newCampers = append
            ? [...state.campers, ...data.items]
            : data.items;

          set({
            campers: newCampers,
            page: query.page ?? 1,
            hasMore: newCampers.length < data.total,
          });
        } catch {
          set({ error: "Failed to load campers" });
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "traveltrucks_store",
      version: 1,

      partialize: state => ({
        favoriteIds: state.favoriteIds,
      }),
    },
  ),
);

// ключ треба name: "traveltrucks_store"? Бо persist зберігає дані в localStorage, а name — це назва “комірки”, куди записати.
// Тобто в браузері буде:
// localStorage["traveltrucks_store"] = { favoriteIds: [...] }
// щоб НЕ зберігати campers/page/loading в localStorage,
// а зберігати тільки favorites
