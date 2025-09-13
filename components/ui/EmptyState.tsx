import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

type Props = {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  tone?: "muted" | "success" | "danger";
  className?: string;
};

export default function EmptyState({
  icon = "sparkles-outline",
  title,
  subtitle,
  tone = "muted",
  className = "",
}: Props) {
  const toneClasses =
    tone === "success"
      ? "bg-emerald-50 border-emerald-100"
      : tone === "danger"
        ? "bg-rose-50 border-rose-100"
        : "bg-gray-50 border-gray-100";

  const iconColor =
    tone === "success" ? "#10B981" : tone === "danger" ? "#EF4444" : "#6B7280";

  return (
    <View
      className={`rounded-2xl border px-4 py-5 items-center ${toneClasses} ${className}`}
    >
      <Ionicons name={icon} size={20} color={iconColor} />
      <Text className="text-slate-800 font-extrabold mt-2">{title}</Text>
      {!!subtitle && (
        <Text className="text-slate-500 font-semibold mt-1 text-center">
          {subtitle}
        </Text>
      )}
    </View>
  );
}
