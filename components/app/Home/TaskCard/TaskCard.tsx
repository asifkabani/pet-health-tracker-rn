import { TaskCardProps } from "@/types/task";
import { getTaskColor } from "@/util/colors";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import React, { memo, useRef } from "react";
import { Pressable, Text, View } from "react-native";
import Swipeable, {
  SwipeableMethods,
} from "react-native-gesture-handler/ReanimatedSwipeable";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useTaskCard } from "./useTaskCard";

const TaskCardComponent = ({ task, onDone }: TaskCardProps) => {
  const swipeRef = useRef<SwipeableMethods | null>(null);
  const { memoizedMinutesText } = useTaskCard(task);
  const { avatar, title, subtitle, status } = task;
  const {
    bgColor,
    borderColor,
    avatarBorder,
    minsText,
    doneBtn,
    iconBgColor,
    iconTextColor,
  } = getTaskColor(status);

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
        className={`${bgColor} rounded-2xl p-4 border-hairline ${borderColor} backdrop-blur-sm overflow-hidden`}
      >
        {status === "overdue" && (
          <View className="absolute left-0 top-0 bottom-0 w-1.5 bg-red-500 rounded-tl-2xl rounded-bl-2xl" />
        )}
        <View className="flex-row gap-3">
          <Image
            source={avatar}
            className={`w-12 h-12 rounded-full border-2 ${avatarBorder}`}
          />
          <View className="flex-1">
            <Text className="font-semibold text-gray-800">{title}</Text>
            <Text className={`mt-1 text-gray-500 font-semibold ${minsText}`}>
              {memoizedMinutesText}
            </Text>
            <Text className="text-xs text-gray-500">{subtitle}</Text>
          </View>

          <View className="items-center justify-between">
            <Pressable
              onPress={() => {
                Haptics.selectionAsync();
                onDone?.();
              }}
              className={`${doneBtn} px-4 py-2 rounded-xl shadow-sm`}
            >
              <Text className="text-white text-sm font-medium">Done</Text>
            </Pressable>

            <View className={`${iconBgColor} mt-2 px-3 py-2 rounded-xl`}>
              <Ionicons name="time-outline" size={14} color={iconTextColor} />
            </View>
          </View>
        </View>
      </Animated.View>
    </Swipeable>
  );
};

export const TaskCard = memo(TaskCardComponent);
