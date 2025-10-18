import React from "react";
import { ActivityIndicator, Pressable, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SIGN_IN_PALETTE } from "@/constants";
import { Ionicons } from "@expo/vector-icons";

type PrimaryButtonProps = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  containerStyle?: any;
  gradientColors?: readonly [string, string];
};

export const PrimaryButton = ({
  title,
  onPress,
  loading,
  disabled,
  containerStyle,
  gradientColors,
}: PrimaryButtonProps) => {
  const colors = gradientColors ?? [SIGN_IN_PALETTE.purpleA, SIGN_IN_PALETTE.purpleB] as const;
  return (
    <Pressable
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        (disabled || loading) && { opacity: 0.6 },
        pressed && !disabled && !loading && { opacity: 0.9, transform: [{ scale: 0.99 }] },
        containerStyle,
      ]}
    >
      <LinearGradient
        colors={colors as any}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Ionicons name="paw" size={18} color="#fff" />
            <Text style={styles.text}>{title}</Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" />
          </>
        )}
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: 18, height: 52, borderRadius: 14, overflow: "hidden" },
  gradient: {
    flex: 1,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  text: { color: "#FFF", fontWeight: "900", fontSize: 16 },
});
