// lib/store/filtersStore.ts

import { create } from "zustand";

export type EquipmentKey =
  | "AC"
  | "kitchen"
  | "bathroom"
  | "TV"
  | "radio"
  | "refrigerator"
  | "microwave"
  | "gas"
  | "water";

interface FiltersState {
  location: string;
  form: string | null; // тип кузова: "alcove", "fullyIntegrated" і т.д.
  equipment: EquipmentKey[];

  setLocation: (value: string) => void;
  setForm: (value: string | null) => void;
  toggleEquipment: (key: EquipmentKey) => void;
  resetFilters: () => void;
}

export const useFiltersStore = create<FiltersState>((set, get) => ({
  location: "",
  form: null,
  equipment: [],

  setLocation: value => set({ location: value }),

  setForm: value => set({ form: value }),

  toggleEquipment: key => {
    const { equipment } = get();

    if (equipment.includes(key)) {
      set({
        equipment: equipment.filter(item => item !== key),
      });
    } else {
      set({
        equipment: [...equipment, key],
      });
    }
  },

  resetFilters: () =>
    set({
      location: "",
      form: null,
      equipment: [],
    }),
}));
