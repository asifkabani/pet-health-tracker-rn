// components/TaskCard.tsx
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import React from "react";
import { Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  FadeInDown,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

// --- Types and Color Mappings ---
export type TaskStatus = "overdue" | "due-soon" | "normal" | "appointment";

interface Task {
  id: number;
  title: string;
  time: string;
  description: string;
  avatar: string;
  status: string;
}

const statusColors: any = {
  overdue: {
    bg: "bg-red-50",
    border: "border-red-500",
    button: "bg-red-500",
    text: "text-red-600",
  },
  "due-soon": {
    bg: "bg-blue-50",
    border: "border-blue-500",
    button: "bg-blue-500",
    text: "text-blue-600",
  },
  normal: {
    bg: "bg-green-50",
    border: "border-green-500",
    button: "bg-green-500",
    text: "text-green-600",
  },
  appointment: {
    bg: "bg-purple-50",
    border: "border-purple-500",
    button: "bg-purple-500",
    text: "text-purple-600",
  },
};

interface TaskCardProps {
  task: Task;
  index: number;
  onComplete: (taskId: number) => void;
}

const TaskCard = ({ task, index, onComplete }: TaskCardProps) => {
  const colors = statusColors[task.status];
  const translateX = useSharedValue(0);
  const cardOpacity = useSharedValue(1);
  const cardHeight = useSharedValue(110); // Approximate height

  const completeTask = () => {
    onComplete(task.id);
  };

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10]) // Don't trigger on small accidental pans
    .onChange((event) => {
      if (event.translationX > 0) {
        // Only allow swiping right
        translateX.value = event.translationX;
      }
    })
    .onEnd((event) => {
      if (event.translationX > 100) {
        // Animate out and trigger completion
        translateX.value = withTiming(500, { duration: 300 });
        cardOpacity.value = withTiming(0, { duration: 250 });
        cardHeight.value = withTiming(0, { duration: 400 });
        runOnJS(Haptics.notificationAsync)(
          Haptics.NotificationFeedbackType.Success
        );
        runOnJS(completeTask)();
      } else {
        // Spring back to original position
        translateX.value = withTiming(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: cardOpacity.value,
    height: cardHeight.value,
    marginBottom: cardHeight.value > 0 ? 12 : 0, // Animate margin as well
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        style={animatedStyle}
        entering={FadeInDown.delay(index * 100).duration(400)}
      >
        <View
          className={`flex-row items-center p-4 rounded-2xl border-l-4 ${colors.bg} ${colors.border}`}
        >
          <Image
            source={{ uri: task.avatar }}
            className="h-12 w-12 rounded-full mr-4"
          />
          <View className="flex-1">
            <Text className="text-base font-bold text-gray-800">
              {task.title}
            </Text>
            <Text className={`text-sm font-semibold ${colors.text}`}>
              {task.time}
            </Text>
            <Text className="text-sm text-gray-500 mt-1">
              {task.description}
            </Text>
          </View>
          <View className="items-center ml-4 space-y-2">
            <Animated.View
              className={`${colors.button} px-4 py-2 rounded-full`}
            >
              <Text className="font-bold text-white">Done</Text>
            </Animated.View>
            <Ionicons name="alarm-outline" size={24} color="#9CA3AF" />
          </View>
        </View>
      </Animated.View>
    </GestureDetector>
  );
};

export default TaskCard;
