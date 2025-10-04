import { Button } from "@/components/shared/Button/Button";
import { useTaskStore } from "@/store/tasks";
import { TaskCardProps, TaskStatus } from "@/types/task";
import { Image } from "expo-image";
import React, { memo } from "react";
import { Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useTaskCard } from "./useTaskCard";

const TaskCardComponent = ({ task }: TaskCardProps) => {
  const { memoizedMinutesText } = useTaskCard(task);
  const { updateTask } = useTaskStore();
  const { id, avatar, title, subtitle, status } = task;

  //TODO: Tailwind Does not let it build dynamically so keeping it here
  //figure this out later
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

  const handleDone = () => {
    updateTask(id, { ...task, status: TaskStatus.Done });
  };

  return (
    <Animated.View
      entering={FadeInDown.springify()}
      className={`${getTaskColor(status).bgColor} rounded-2xl p-4 border-hairline ${getTaskColor(status).borderColor} backdrop-blur-sm overflow-hidden`}
    >
      {status === "overdue" && (
        <View className="absolute left-0 top-0 bottom-0 w-1.5 bg-red-500 rounded-tl-2xl rounded-bl-2xl" />
      )}
      <View className="flex-row gap-3 items-center">
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
        <Button
          text="Done"
          bgColorClass={`${getTaskColor(status).doneBtn}`}
          onPress={handleDone}
        />
      </View>
    </Animated.View>
  );
};

export const TaskCard = memo(TaskCardComponent);
