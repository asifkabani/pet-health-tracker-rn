import { useAuthStore } from "@/store/auth";
import { Slot, useRouter, useSegments } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import "../global.css";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { user, hydrated } = useAuthStore();

  // Simple redirect logic:
  useEffect(() => {
    if (!hydrated) return;
    const inAuth = segments[0] === "(auth)";

    if (user && inAuth) {
      router.replace("/(tabs)");
    } else if (!user && !inAuth) {
      router.replace("/(auth)/sign-in");
    }
  }, [hydrated, user, segments]);

  if (!hydrated) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator />
      </View>
    );
  }

  return <Slot />;
}
