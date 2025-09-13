// app/_layout.tsx (excerpt)
import { useAuthStore } from "@/store/auth";
import { useOnboardingStore } from "@/store/onboarding";
import { usePetsStore } from "@/store/pets";
import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { user, hydrated } = useAuthStore();
  const { pets } = usePetsStore();
  const { skipPetOnboarding } = useOnboardingStore();

  useEffect(() => {
    if (!hydrated) return;

    const inAuth = segments[0] === "(auth)";
    const inOnboarding = segments[0] === ("(onboarding)" as any);

    // 1) Not logged in → go to auth
    if (!user && !inAuth) {
      router.replace("/(auth)/sign-in");
      return;
    }
    // 2) Logged in but in auth → go to tabs or onboarding
    if (user && inAuth) {
      if (pets.length === 0 && !skipPetOnboarding) {
        router.replace("/(onboarding)/pet-profile" as any);
      } else {
        router.replace("/(tabs)");
      }
      return;
    }
    // 3) Logged in, no pets, didn't skip → force onboarding
    if (user && pets.length === 0 && !skipPetOnboarding && !inOnboarding) {
      router.replace("/(onboarding)/pet-profile" as any);
    }
  }, [hydrated, user, pets.length, skipPetOnboarding, segments]);

  return <Slot />;
}
