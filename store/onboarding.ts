import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type OnboardingState = {
  skipPetOnboarding: boolean;
  setSkipPetOnboarding: (v: boolean) => void;
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      skipPetOnboarding: false,
      setSkipPetOnboarding: (v) => set({ skipPetOnboarding: v }),
    }),
    {
      name: "@petcare/onboarding",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
