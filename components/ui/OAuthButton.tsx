import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text } from "react-native";

export default function OAuthButton({
  provider,
  onPress,
}: {
  provider: "google" | "apple";
  onPress: () => void;
}) {
  const isGoogle = provider === "google";
  return (
    <Pressable
      onPress={onPress}
      className="h-12 rounded-xl border border-indigo-50 bg-white items-center justify-center flex-row gap-2"
    >
      <Ionicons
        name={isGoogle ? "logo-google" : "logo-apple"}
        size={18}
        color="#111827"
      />
      <Text className="text-slate-900 font-extrabold">
        Continue with {isGoogle ? "Google" : "Apple"}
      </Text>
    </Pressable>
  );
}
