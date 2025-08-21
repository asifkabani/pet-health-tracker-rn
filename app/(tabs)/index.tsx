import { Header } from "@/components/app/Home/Header/Header";
import { Progress } from "@/components/app/Home/Progress/Progress";
import { TaskList } from "@/components/app/Home/TaskList/TaskList";

import { SegmentedTabsControl } from "@/components/shared/SegmentedTabs/SegmentedTabs";
import { INITIAL_TASKS } from "@/constants";
import { Task } from "@/types/task";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { ScrollView } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { FadeIn } from "react-native-reanimated";

export default function HomeScreen() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const tabsValues = ["Today", "Upcoming", "Overdue"];

  return (
    <GestureHandlerRootView className="flex-1">
      <Animated.View className="flex-1" entering={FadeIn.duration(300)}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <LinearGradient colors={["#FAF5FF", "#FDF2F8"]}>
            <Header />
            <SegmentedTabsControl
              tabsValues={tabsValues}
              selectedIndex={selectedIndex}
              setSelectedIndex={setSelectedIndex}
            />
            <TaskList tasks={tasks} selectedIndex={selectedIndex} />
            <Progress completed="2" pendingCount={0} />
          </LinearGradient>
        </ScrollView>
      </Animated.View>
    </GestureHandlerRootView>
  );
}
