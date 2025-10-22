import { SIGN_IN_GRADIENT, SIGN_IN_PALETTE } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type HeaderHeroProps = {
  title: string;
  subtitle: string;
  logoStyle?: any;
  subtitleStyle?: any;
  containerClassName?: string;
};

export const HeaderHero = ({
  title,
  subtitle,
  logoStyle,
  subtitleStyle,
  containerClassName,
}: HeaderHeroProps) => {
  return (
    <LinearGradient
      colors={SIGN_IN_GRADIENT}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.topRow}>
        <View style={[styles.logoCircle, logoStyle]}>
          <Ionicons name="paw" size={22} color={SIGN_IN_PALETTE.purpleA} />
        </View>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={[styles.subtitle, subtitleStyle]}>{subtitle}</Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { paddingTop: 24, paddingHorizontal: 24, paddingBottom: 28 },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  logoCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  title: { fontSize: 20, fontWeight: "900", color: "#0F172A" },
  subtitle: { marginTop: 6, color: SIGN_IN_PALETTE.sub, fontWeight: "600" },
});
