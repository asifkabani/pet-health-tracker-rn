// app/(tabs)/index.tsx
import { LinearGradient } from "expo-linear-gradient";
import { cssInterop } from "nativewind";
import React, { useEffect, useMemo, useState } from "react";
import { ScrollView } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { FadeIn } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { Header } from "@/components/app/Home/Header/Header";
import { Progress } from "@/components/app/Home/Progress/Progress";
import { TaskList } from "@/components/app/Home/TaskList/TaskList";
import { SegmentedTabsControl } from "@/components/shared/SegmentedTabs/SegmentedTabs";

import { INITIAL_TASKS } from "@/constants";
import { useHomePage } from "@/hooks/useHomePage/useHomePage";
import { useBadgeStore } from "@/store/badges";
import { Task } from "@/types/task";

const LG = cssInterop(LinearGradient, { className: "style" });
const TAB_KEYS = ["today", "upcoming", "overdue"] as const;
type TabKey = (typeof TAB_KEYS)[number];

export default function HomeScreen() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const tabsValues = ["Today", "Upcoming", "Overdue"];
  const { date, timeOfDay, userName, pets } = useHomePage();

  // --- derive counts per tab (assumes Task has .status; fallback to "today") ---
  const counts = useMemo(() => {
    const c: Record<TabKey, number> = { today: 0, upcoming: 0, overdue: 0 };
    for (const t of tasks) {
      const status = ((t as any).status ?? "today") as TabKey;
      if (status in c) c[status] += 1;
    }
    return c;
  }, [tasks]);

  // visible tasks for the current tab (keeps your existing TaskList API intact)
  const selectedKey: TabKey = TAB_KEYS[selectedIndex] ?? "today";
  const visibleTasks = useMemo(
    () => tasks.filter((t) => ((t as any).status ?? "today") === selectedKey),
    [tasks, selectedKey]
  );

  // --- update Home tab badge (route name = "index") with Overdue count ---
  const setTabBadge = useBadgeStore((s) => s.setTabBadge);
  useEffect(() => {
    setTabBadge("index", counts.overdue);
  }, [counts.overdue, setTabBadge]);

  const pendingTotal = counts.today + counts.upcoming + counts.overdue;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <GestureHandlerRootView>
        <Animated.View className="flex-1" entering={FadeIn.duration(300)}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24 }}
          >
            <LG
              colors={["#FAF5FF", "#FDF2F8"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="px-5 pt-4 pb-6"
            >
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

              {/* Use filtered tasks for snappier UX; keep your component signature */}
              <TaskList tasks={visibleTasks} selectedIndex={selectedIndex} />

              {/* Wire a real pending count (keep completed static if your component expects it) */}
              <Progress completed="2" pendingCount={pendingTotal} />
            </LG>
          </ScrollView>
        </Animated.View>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}
