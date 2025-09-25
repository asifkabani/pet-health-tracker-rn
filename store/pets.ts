import { Pet } from "@/types/pet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type PetState = {
  pets: Pet[];
  addPet: (pet: Pet) => void;
  updatePet: (id: string, patch: Partial<Pet>) => void;
  removePet: (id: string) => void;
  clearAll: () => void;
};

export const usePetsStore = create<PetState>()(
  persist(
    (set) => ({
      pets: [],
      addPet: (pet) => set((state) => ({ pets: [pet, ...state.pets] })),
      updatePet: (id, patch) =>
        set((state) => ({
          pets: state.pets.map((pet) =>
            pet.id === id ? { ...pet, ...patch } : pet
          ),
        })),
      removePet: (id) =>
        set((state) => ({ pets: state.pets.filter((pet) => pet.id !== id) })),
      clearAll: () => set({ pets: [] }),
    }),
    { name: "@petcare/pets", storage: createJSONStorage(() => AsyncStorage) }
  )
);
