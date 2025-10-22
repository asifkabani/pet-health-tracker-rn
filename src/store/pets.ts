import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type PetKind = "dog" | "cat" | "other";
export type Pet = {
  id: string;
  name: string;
  kind: PetKind;
  breed?: string;
  birthday?: string; // ISO or mm/dd/yyyy string
  avatarUrl?: string;
};

type PetsState = {
  pets: Pet[];
  addPet: (p: Pet) => void;
  updatePet: (id: string, patch: Partial<Pet>) => void;
  removePet: (id: string) => void;
  clearAll: () => void;
};

export const usePetsStore = create<PetsState>()(
  persist(
    (set) => ({
      pets: [],
      addPet: (p) => set((s) => ({ pets: [p, ...s.pets] })),
      updatePet: (id, patch) =>
        set((s) => ({
          pets: s.pets.map((p) => (p.id === id ? { ...p, ...patch } : p)),
        })),
      removePet: (id) =>
        set((s) => ({ pets: s.pets.filter((p) => p.id !== id) })),
      clearAll: () => set({ pets: [] }),
    }),
    { name: "@petcare/pets", storage: createJSONStorage(() => AsyncStorage) }
  )
);

export const makeId = () =>
  Math.random().toString(36).slice(2) + Date.now().toString(36);
