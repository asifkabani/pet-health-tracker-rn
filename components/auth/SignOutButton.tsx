import { useAuthStore } from "@/store/auth";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable, Text } from "react-native";

export default function SignOutButton() {
  const { signOut } = useAuthStore();

  const onPress = async () => {
    await signOut();
    router.replace("/(auth)/sign-in");
  };

  return (
    <Pressable
      onPress={onPress}
      className="h-12 rounded-xl border border-rose-200 bg-rose-50 items-center justify-center flex-row gap-2"
      accessibilityRole="button"
      accessibilityLabel="Sign out"
    >
      <Ionicons name="log-out-outline" size={18} color="#B91C1C" />
      <Text className="text-rose-700 font-extrabold">Sign out</Text>
    </Pressable>
  );
}
