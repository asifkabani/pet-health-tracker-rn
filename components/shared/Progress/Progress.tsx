import { PADDING_H, PALETTE } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { ProgressTile } from "../ProgressTile/ProgressTile";

const ProgressComponent = ({
  completed,
  pendingCount,
}: {
  completed: string;
  pendingCount: number;
}) => {
  return (
    <Animated.View
      entering={FadeInDown.delay(150).springify()}
      style={{ paddingHorizontal: PADDING_H, marginTop: 24 }}
    >
      <Text style={styles.sectionTitle}>Today's Progress</Text>
      <View style={styles.progressGrid}>
        <ProgressTile
          icon={<Ionicons name="checkmark-circle" size={28} />}
          label="Completed"
          value={completed.length}
        />
        <ProgressTile
          icon={<Ionicons name="time-outline" size={28} />}
          label="Pending"
          value={pendingCount}
        />
        <ProgressTile
          icon={<Ionicons name="flame-outline" size={28} />}
          label="Day Streak"
          value={7}
        />
      </View>
    </Animated.View>
  );
};

export const Progress = memo(ProgressComponent)

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: PALETTE.text,
    marginBottom: 12,
  },
  progressGrid: {
    flexDirection: "row",
    gap: 14,
    justifyContent: "space-between",
  },
});
