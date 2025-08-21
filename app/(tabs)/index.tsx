import { Header } from "@/components/app/Home/Header/Header";
import { Progress } from "@/components/app/Home/Progress/Progress";
import { TaskList } from "@/components/app/Home/TaskList/TaskList";

import { SegmentedTabsControl } from "@/components/shared/SegmentedTabs/SegmentedTabs";
import { INITIAL_TASKS } from "@/constants";
import { Task, TaskStatus } from "@/types/task";
import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo, useState } from "react";
import { ScrollView } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { FadeIn } from "react-native-reanimated";

export default function HomeScreen() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [completed, setCompleted] = useState<Task[]>([]);
  const [selected, setSelected] = useState<TaskStatus>(TaskStatus.Today);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const tabsValues = useMemo(() => ["Today", "Upcoming", "Overdue"], []);

  // const counts = useMemo(() => {
  //   const c: Record<TabKey, number> = { today: 0, upcoming: 0, overdue: 0 };
  //   tasks
  //     .filter((t) => !completed.includes(t.id))
  //     .forEach((t) => (c[t.status] += 1));
  //   return c;
  // }, [tasks, completed]);

  // const pendingCount = counts.today + counts.upcoming + counts.overdue;

  // countdown update (every 30s)
  // useEffect(() => {
  //   const t = setInterval(() => {
  //     setTasks((prev) =>
  //       prev.map((x) => ({ ...x, dueInMinutes: x.dueInMinutes - 0.5 }))
  //     );
  //   }, 30000);
  //   return () => clearInterval(t);
  // }, []);

  return (
    <GestureHandlerRootView className="flex-1">
      <Animated.View className="flex-1" entering={FadeIn.duration(300)}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 48 }}
          showsVerticalScrollIndicator={false}
        >
          <LinearGradient colors={["#FAF5FF", "#FDF2F8"]}>
            <Header />
            <SegmentedTabsControl
              tabsValues={tabsValues}
              selectedIndex={selectedIndex}
              setSelectedIndex={setSelectedIndex}
            />
            <TaskList
              tasks={tasks}
              selected={selected}
              completed={completed}
              setCompleted={setCompleted}
            />
            <Progress completed="2" pendingCount={0} />
          </LinearGradient>
        </ScrollView>
      </Animated.View>
    </GestureHandlerRootView>
  );
}
