import { TaskCardProps, TaskStatus } from "@/types/task";
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

  //TODO: Tailwind Does not let it build dynamically so keeping it here
  const TASK_COLOR = {
    error: {
      bgColor: "bg-red-50",
      borderColor: "border-red-400",
      avatarBorder: "border-red-200",
      minsText: "text-red-600",
      doneBtn: "bg-red-500",
      iconBgColor: "bg-red-100",
      iconTextColor: "#dc2626",
    },
    default: {
      bgColor: "bg-white/80",
      borderColor: "border-purple-100",
      avatarBorder: "border-blue-200",
      minsText: "text-blue-600",
      doneBtn: "bg-blue-500",
      iconBgColor: "bg-blue-100",
      iconTextColor: "#2563eb",
    },
  };

  const getTaskColor = (status: TaskStatus) => {
    if (status === TaskStatus.Overdue) {
      return TASK_COLOR.error;
    }

    return TASK_COLOR.default;
  };

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
        className={`${getTaskColor(status).bgColor} rounded-2xl p-4 border-hairline ${getTaskColor(status).borderColor} backdrop-blur-sm overflow-hidden`}
      >
        {status === "overdue" && (
          <View className="absolute left-0 top-0 bottom-0 w-1.5 bg-red-500 rounded-tl-2xl rounded-bl-2xl" />
        )}
        <View className="flex-row gap-3">
          <Image
            source={avatar}
            className={`w-12 h-12 rounded-full border-2 ${getTaskColor(status).avatarBorder}`}
          />
          <View className="flex-1">
            <Text className="font-semibold text-gray-800">{title}</Text>
            <Text
              className={`mt-1 text-gray-500 font-semibold ${getTaskColor(status).minsText}`}
            >
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
              className={`${getTaskColor(status).doneBtn} px-4 py-2 rounded-xl shadow-sm`}
            >
              <Text className="text-white text-sm font-medium">Done</Text>
            </Pressable>

            <View
              className={`${getTaskColor(status).iconBgColor} mt-2 px-3 py-2 rounded-xl`}
            >
              <Ionicons
                name="time-outline"
                size={14}
                color={getTaskColor(status).iconTextColor}
              />
            </View>
          </View>
        </View>
      </Animated.View>
    </Swipeable>
  );
};

export const TaskCard = memo(TaskCardComponent);
