import { PALETTE } from "@/constants";
import { PetTaskCardProps } from "@/types/pet";
import { textFrom, tintFrom } from "@/util/colors";
import { Ionicons } from "@expo/vector-icons";
import { useRef } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Swipeable, {
  SwipeableMethods,
} from "react-native-gesture-handler/ReanimatedSwipeable";

export const PetTaskCard = ({
  task,
  onDone,
  onSnooze,
  disabled,
  rightIcon = "time-outline",
}: PetTaskCardProps) => {
  const swipeRef = useRef<SwipeableMethods | null>(null);

  return (
    <Swipeable
      ref={swipeRef}
      enabled={!disabled}
      renderLeftActions={() => (
        <View className="bg-green-600 rounded-2xl mr-2 items-center justify-center px-3">
          <Ionicons name="checkmark-done" size={26} color="#fff" />
          <Text className="text-white font-bold mt-1">Done</Text>
        </View>
      )}
      leftThreshold={48}
      onSwipeableOpen={() => {
        swipeRef.current?.close();
        onDone?.();
      }}
    >
      <View
        className="bg-white rounded-xl p-4 border border-orange-200 shadow-sm"
        style={[styles.card, { borderColor: task.tint }]}
      >
        <View style={styles.cardTopRow}>
          <View style={styles.leftTitle}>
            <View style={[styles.dot, { backgroundColor: task.dot }]} />
            <Text style={styles.cardTitle}>{task.kind}</Text>
          </View>

          <View style={[styles.chip, { backgroundColor: tintFrom(task.tint) }]}>
            <Text style={[styles.chipTxt, { color: textFrom(task.tint) }]}>
              {task.chip}
            </Text>
          </View>
        </View>

        <Text style={styles.cardSub}>{task.detail}</Text>

        <View style={styles.cardActions}>
          <Pressable
            disabled={disabled}
            onPress={() => onDone?.()}
            style={({ pressed }) => [
              styles.doneBtn,
              pressed && !disabled && { transform: [{ scale: 0.98 }] },
              disabled && { opacity: 0.8 },
            ]}
          >
            <Ionicons name="checkmark-outline" size={18} color="#fff" />
            <Text style={styles.doneTxt}>Done</Text>
          </Pressable>

          <Pressable
            disabled={disabled}
            onPress={() => onSnooze?.()}
            style={({ pressed }) => [
              styles.snooze,
              pressed && !disabled && { opacity: 0.85 },
            ]}
          >
            <Ionicons name={rightIcon} size={18} color="#111827" />
          </Pressable>
        </View>
      </View>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  /* Cards */
  card: {
    backgroundColor: PALETTE.card,
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
  },
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftTitle: { flexDirection: "row", alignItems: "center" },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  cardTitle: { fontSize: 20, fontWeight: "800", color: PALETTE.text },
  chip: {
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipTxt: {
    fontWeight: "800",
  },
  cardSub: {
    marginTop: 10,
    color: PALETTE.sub,
    fontSize: 16,
    fontWeight: "600",
  },
  cardActions: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
  },
  doneBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: PALETTE.green,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  doneTxt: {
    color: "#fff",
    fontWeight: "900",
    marginLeft: 6,
    fontSize: 16,
  },
  snooze: {
    width: 48,
    height: 48,
    marginLeft: 10,
    borderRadius: 12,
    backgroundColor: "#F2F4F7",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ECECEC",
  },

  leftAction: {
    width: 90,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    marginRight: 8,
  },
});
