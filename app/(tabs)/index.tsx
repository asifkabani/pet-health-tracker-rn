import React, { useEffect, useMemo, useState } from "react";
import { ScrollView } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { Header } from "@/components/app/Home/Header/Header";
import { Progress } from "@/components/app/Home/Progress/Progress";
import { TaskList } from "@/components/app/Home/TaskCard/TaskList";
import { SegmentedTabsControl } from "@/components/shared/SegmentedTabs/SegmentedTabs";
import { INITIAL_TASKS } from "@/constants";
import { useBadgeStore } from "@/store/badges";
import { usePetsStore } from "@/store/pets";
import { Task } from "@/types/task";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

const TAB_KEYS = ["today", "upcoming", "overdue"] as const;
type TabKey = (typeof TAB_KEYS)[number];

export default function HomeScreen() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const tabsValues = ["Today", "Upcoming", "Overdue"];
  const petsCount = usePetsStore((s) => s.pets.length);

  const counts = useMemo(() => {
    const c: Record<TabKey, number> = { today: 0, upcoming: 0, overdue: 0 };
    for (const t of tasks) {
      const status = ((t as any).status ?? "today") as TabKey;
      if (status in c) c[status] += 1;
    }
    return c;
  }, [tasks]);

  const selectedKey: TabKey = TAB_KEYS[selectedIndex] ?? "today";
  const visibleTasks = useMemo(
    () => tasks.filter((t) => ((t as any).status ?? "today") === selectedKey),
    [tasks, selectedKey]
  );

  const setTabBadge = useBadgeStore((s) => s.setTabBadge);

  useEffect(() => {
    setTabBadge("index", counts.overdue);
  }, [counts.overdue, setTabBadge]);

  const pendingTotal = counts.today + counts.upcoming + counts.overdue;

  if (petsCount === 0) router.push("/(onboarding)/pet-profile" as any);

  return (
    <SafeAreaView className="flex-1 ">
      <Animated.View className="flex-1" entering={FadeIn.duration(300)}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flex: 1 }}
        >
          <LinearGradient
            colors={["#FAF5FF", "#FDF2F8"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="flex-1 pb-6"
          >
            <Header />
            <SegmentedTabsControl
              tabsValues={tabsValues}
              selectedIndex={selectedIndex}
              setSelectedIndex={setSelectedIndex}
            />
            <TaskList tasks={visibleTasks} selectedIndex={selectedIndex} />
            <Progress completed="2" pendingCount={pendingTotal} />
          </LinearGradient>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}
