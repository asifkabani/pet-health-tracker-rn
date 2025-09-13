import { useAuthStore } from "@/store/auth";
import { useOnboardingStore } from "@/store/onboarding";
import { usePetsStore } from "@/store/pets";
import { Redirect, useRootNavigationState } from "expo-router";
import React from "react";
import { View } from "react-native";

export default function Gate() {
  const navReady = !!useRootNavigationState()?.key;

  const { user, hydrated } = useAuthStore();
  const { pets } = usePetsStore();
  const { skipPetOnboarding } = useOnboardingStore();

  if (!navReady || !hydrated) return <View style={{ flex: 1 }} />;

  if (!user) return <Redirect href="/(auth)/sign-in" />;

  if (pets.length === 0 && !skipPetOnboarding) {
    return <Redirect href="/(onboarding)/pet-profile" />;
  }

  return <Redirect href="/(tabs)" />;
}
