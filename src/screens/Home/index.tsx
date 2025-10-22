import { Header } from "./components/Header";
import { Progress } from "./components/Progress";
import { TaskList } from "./components/TaskList";

import { SegmentedTabsControl } from "@/components/tabs";
import { INITIAL_TASKS } from "@/constants";
import { useHomePage } from "@/hooks/useHomePage";
import { Task } from "@/types/task";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { ScrollView } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { FadeIn } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const tabsValues = ["Today", "Upcoming", "Overdue"];
  const { date, timeOfDay, userName, pets } = useHomePage();

  return (
    <SafeAreaView className="flex-1">
      <GestureHandlerRootView>
        <Animated.View className="flex-1" entering={FadeIn.duration(300)}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <LinearGradient colors={["#FAF5FF", "#FDF2F8"]}>
              <Header
                date={date}
                timeOfDay={timeOfDay}
                userName={userName}
                pets={pets}
              />
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
    </SafeAreaView>
  );
}
