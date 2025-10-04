import { AuthUser } from "@/types/user";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type AuthState = {
  user: AuthUser | null;
  hydrated: boolean;
  setHydrated(v: boolean): void;
  signIn(user: AuthUser): void;
  signOut(): Promise<void>;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      hydrated: false,
      setHydrated: (v) => set({ hydrated: v }),
      signIn: (user) => set({ user }),
      signOut: async () => {
        // clear any extra flags you might have set elsewhere
        await AsyncStorage.removeItem("@petcare:onboarding");
        // This updates the persisted state to user:null
        set({ user: null });
      },
    }),
    {
      name: "@petcare/auth",
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
