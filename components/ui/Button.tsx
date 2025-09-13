import { LinearGradient } from "expo-linear-gradient";
import { cssInterop } from "nativewind";
import React from "react";
import { ActivityIndicator, Pressable, Text } from "react-native";
const LG = cssInterop(LinearGradient, { className: "style" });

type Props = {
  title: string;
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
  left?: React.ReactNode;
  right?: React.ReactNode;
  className?: string;
  variant?: "primary" | "outline";
};

export default function Button({
  title,
  onPress,
  loading,
  disabled,
  left,
  right,
  className = "",
  variant = "primary",
}: Props) {
  if (variant === "primary") {
    return (
      <Pressable
        disabled={disabled || loading}
        onPress={onPress}
        className={`h-13 rounded-xl overflow-hidden ${disabled ? "opacity-60" : ""}`}
      >
        <LG
          className="flex-1 items-center justify-center flex-row gap-2 rounded-xl"
          colors={["#7C3AED", "#6D28D9"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              {left}
              <Text className="text-white font-extrabold text-base">
                {title}
              </Text>
              {right}
            </>
          )}
        </LG>
      </Pressable>
    );
  }

  return (
    <Pressable
      disabled={disabled || loading}
      onPress={onPress}
      className={`h-12 rounded-xl border border-slate-200 bg-white items-center justify-center flex-row gap-2 ${className}`}
    >
      {loading ? (
        <ActivityIndicator />
      ) : (
        <>
          {left}
          <Text className="text-slate-900 font-extrabold text-base">
            {title}
          </Text>
          {right}
        </>
      )}
    </Pressable>
  );
}
