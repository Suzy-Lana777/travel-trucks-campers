// lib/store/campersStore.ts
import { create } from "zustand";
import type { Camper } from "@/types/camper";
import { getCampers, type CampersQueryParams } from "@/lib/api/campersApi";

type CampersState = {
  campers: Camper[];
  page: number;
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  loadCampers: (
    params?: CampersQueryParams,
    options?: { append?: boolean },
  ) => Promise<void>;
};

export const useCampersStore = create<CampersState>((set, get) => ({
  campers: [],
  page: 1,
  isLoading: false,
  error: null,
  hasMore: true,

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
    } catch (e) {
      set({ error: "Failed to load campers" });
    } finally {
      set({ isLoading: false });
    }
  },
}));
