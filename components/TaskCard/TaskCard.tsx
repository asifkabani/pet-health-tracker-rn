import { TaskCardProps } from "@/types/task";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import React, { memo, useRef } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Swipeable, {
  SwipeableMethods,
} from "react-native-gesture-handler/ReanimatedSwipeable";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useTaskCard } from "./useTaskCard";

const TaskCardComponent = ({ task, onDone }: TaskCardProps) => {
  const swipeRef = useRef<SwipeableMethods | null>(null);
  const { memoizedMinutesText } = useTaskCard(task);
  const { avatar, title, subtitle, status, color } = task;

  return (
    <Swipeable
      ref={swipeRef}
      renderLeftActions={() => (
        <View className="bg-green-600 rounded-2xl mr-2 items-center justify-center px-3">
          <Ionicons name="checkmark-done" size={26} color="#fff" />
          <Text className="text-white font-bold mt-1">Done</Text>
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
      <Animated.View
        entering={FadeInDown.springify()}
        className="bg-white rounded-2xl p-4 border-hairline border-purple-50 overflow-hidden"
      >
        {status === "overdue" && (
          <View className="absolute left-0 top-0 bottom-0 w-1.5 bg-red-500 rounded-tl-2xl rounded-bl-2xl" />
        )}
        <View className="flex-row gap-3">
          <Image source={avatar} className="w-12 h-12 rounded-3xl" />
          <View className="flex-1">
            <Text className="text-xl font-extrabold text-neutral-900">
              {title}
            </Text>
            <Text
              className={`mt-1 text-gray-500 font-semibold ${status === "overdue" && "text-red-500"}`}
            >
              {memoizedMinutesText}
            </Text>
            <Text className="mt-2">{subtitle}</Text>
          </View>

          <View className="items-center justify-between">
            <Pressable
              onPress={() => {
                Haptics.selectionAsync();
                onDone?.();
              }}
              style={({ pressed }) => [
                styles.doneBtn,
                { backgroundColor: color },
                pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
              ]}
            >
              <Text className="text-white font-semibold">Done</Text>
            </Pressable>

            <View className="mt-2 bg-indigo-50 p-2 rounded-xl">
              <Ionicons name="time-outline" size={14} color="#2563EB" />
            </View>
          </View>
        </View>
      </Animated.View>
    </Swipeable>
  );
};

export const TaskCard = memo(TaskCardComponent);

const styles = StyleSheet.create({
  doneBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
});
