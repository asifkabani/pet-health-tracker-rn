import { AVATAR_SIZE, PADDING_H, PALETTE } from "@/constants";
import { TaskCardProps } from "@/types/task";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import React, { memo, useRef } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useTaskCard } from "./useTaskCard";

const TaskCardComponent = ({ task, onDone }: TaskCardProps) => {
  const swipeRef = useRef<Swipeable | null>(null);
  const { memoizedMinutesText } = useTaskCard(task);
  const { avatar, title, subtitle, status } = task;

  return (
    <Swipeable
      ref={swipeRef}
      renderLeftActions={() => (
        <View style={[styles.leftAction]}>
          <Ionicons name="checkmark-done" size={26} color="#fff" />
          <Text style={{ color: "white", fontWeight: "700", marginTop: 6 }}>
            Done
          </Text>
        </View>
      )}
      leftThreshold={48}
      overshootLeft={false}
      onSwipeableOpen={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        swipeRef.current?.close();
        onDone?.();
      }}
    >
      <Animated.View entering={FadeInDown.springify()} style={styles.card}>
        {task.status === "overdue" && <View style={styles.overdueStripe} />}
        <View style={styles.row}>
          <Image source={task.avatar} style={styles.petAvatar} />
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>{task.title}</Text>
            <Text
              style={[
                styles.cardDue,
                task.status === "overdue" && {
                  color: PALETTE.red,
                  fontWeight: "700",
                },
              ]}
            >
              {memoizedMinutesText}
            </Text>
            <Text style={styles.cardSub}>{task.subtitle}</Text>
          </View>

          <View style={styles.rightCol}>
            <Pressable
              onPress={() => {
                Haptics.selectionAsync();
                onDone?.();
              }}
              style={({ pressed }) => [
                styles.doneBtn,
                { backgroundColor: task.color },
                pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
              ]}
            >
              <Text style={styles.doneText}>Done</Text>
            </Pressable>

            <View style={styles.clockPill}>
              <Ionicons name="time-outline" size={14} color={PALETTE.blue} />
            </View>
          </View>
        </View>
      </Animated.View>
    </Swipeable>
  );
};

export const TaskCard = memo(TaskCardComponent);

const styles = StyleSheet.create({
  card: {
    backgroundColor: PALETTE.card,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: PALETTE.border,
    overflow: "hidden",
  },
  overdueStripe: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 6,
    backgroundColor: PALETTE.red,
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
  },
  row: { flexDirection: "row", gap: 12 },
  petAvatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    marginRight: 4,
  },
  cardTitle: { fontSize: 20, fontWeight: "800", color: PALETTE.text },
  cardDue: { marginTop: 4, color: PALETTE.sub, fontWeight: "700" },
  cardSub: { marginTop: 6, color: PALETTE.sub },
  rightCol: { alignItems: "center", justifyContent: "space-between" },
  doneBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
  doneText: { color: "white", fontWeight: "800" },
  clockPill: {
    marginTop: 8,
    backgroundColor: "#E6EEFF",
    padding: 8,
    borderRadius: 12,
  },
  leftAction: {
    backgroundColor: PALETTE.green,
    borderRadius: 18,
    marginLeft: PADDING_H,
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
  },
});
