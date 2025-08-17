import { PALETTE } from "@/constants";
import { BlurView } from "expo-blur";
import { JSX, memo } from "react";
import { StyleSheet, Text, View } from "react-native";

type ProgressTileProps = {
  icon: JSX.Element;
  label: string;
  value: number;
};

const ProgressTileComponent = ({ icon, label, value }: ProgressTileProps) => {
  return (
    <BlurView intensity={20} tint="light" style={styles.progressTile}>
      <View style={{ alignItems: "center", gap: 10 }}>
        {icon}
        <Text style={styles.progressValue}>{value}</Text>
        <Text style={styles.progressLabel}>{label}</Text>
      </View>
    </BlurView>
  );
};

export const ProgressTile = memo(ProgressTileComponent);

const styles = StyleSheet.create({
  progressTile: {
    flex: 1,
    paddingVertical: 18,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: PALETTE.border,
    alignItems: "center",
  },
  progressValue: { fontSize: 28, fontWeight: "900", color: PALETTE.purple },
  progressLabel: { color: PALETTE.sub, fontWeight: "700" },
});
