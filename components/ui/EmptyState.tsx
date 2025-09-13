import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

type Props = {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  tone?: "muted" | "success" | "warning";
  className?: string;
  cta?: React.ReactNode;
};

export default function EmptyState({
  icon = "sparkles-outline",
  title,
  subtitle,
  tone = "muted",
  className = "",
  cta,
}: Props) {
  const toneClasses =
    tone === "success"
      ? "bg-emerald-50 border-emerald-100"
      : tone === "warning"
        ? "bg-amber-50 border-amber-100"
        : "bg-gray-50 border-gray-100";

  const iconColor =
    tone === "success" ? "#10B981" : tone === "warning" ? "#F59E0B" : "#6B7280";

  return (
    <View
      className={`rounded-2xl border px-4 py-6 items-center ${toneClasses} ${className}`}
    >
      <Ionicons name={icon} size={22} color={iconColor} />
      <Text className="text-slate-800 font-extrabold mt-2 text-center">
        {title}
      </Text>
      {!!subtitle && (
        <Text className="text-slate-500 font-semibold mt-2 text-center">
          {subtitle}
        </Text>
      )}
      {!!cta && <View className="mt-4 w-full">{cta}</View>}
    </View>
  );
}
