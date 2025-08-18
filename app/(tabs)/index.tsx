import { Header } from "@/components/Header/Header";
import { SegmentedTabsControl } from "@/components/SegmentedTabs/SegmentedTabs";
import { PALETTE } from "@/constants";
import { Task } from "@/types/task";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { FadeIn } from "react-native-reanimated";

const initialTasks: Task[] = [
  {
    id: "1",
    pet: "Bella",
    title: "Bella's Medication",
    subtitle: "Heart medication - Morning dose",
    status: "overdue",
    dueInMinutes: -120,
    color: PALETTE.red,
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256&auto=format&fit=crop",
  },
  {
    id: "2",
    pet: "Max",
    title: "Max's Walk",
    subtitle: "Morning walk - 30 minutes",
    status: "today",
    dueInMinutes: 30,
    color: PALETTE.blue,
    avatar:
      "https://images.unsplash.com/photo-1547425260-76bcadfb4f2f?q=80&w=256&auto=format&fit=crop",
  },
  {
    id: "3",
    pet: "Bella",
    title: "Bella's Feeding",
    subtitle: "Lunch - Wet food with supplements",
    status: "today",
    dueInMinutes: 180,
    color: PALETTE.green,
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256&auto=format&fit=crop",
  },
  {
    id: "4",
    pet: "Both",
    title: "Grooming Appointment",
    subtitle: "Both pets - Nail trimming & bath",
    status: "upcoming",
    dueInMinutes: 300,
    color: PALETTE.purple,
    avatar:
      "https://images.unsplash.com/photo-1541534401786-2077eed87a72?q=80&w=256&auto=format&fit=crop",
  },
];

export default function HomeScreen() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  // const [selected, setSelected] = useState<TabKey>("today");
  const [completed, setCompleted] = useState<string[]>([]);

  // const counts = useMemo(() => {
  //   const c: Record<TabKey, number> = { today: 0, upcoming: 0, overdue: 0 };
  //   tasks
  //     .filter((t) => !completed.includes(t.id))
  //     .forEach((t) => (c[t.status] += 1));
  //   return c;
  // }, [tasks, completed]);

  // const pendingCount = counts.today + counts.upcoming + counts.overdue;

  // countdown update (every 30s)
  useEffect(() => {
    const t = setInterval(() => {
      setTasks((prev) =>
        prev.map((x) => ({ ...x, dueInMinutes: x.dueInMinutes - 0.5 }))
      );
    }, 30000);
    return () => clearInterval(t);
  }, []);

  return (
    <GestureHandlerRootView className="flex-1">
      <Animated.View className="flex-1" entering={FadeIn.duration(300)}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 48 }}
          showsVerticalScrollIndicator={false}
        >
          <LinearGradient colors={["#FAF5FF", "#FDF2F8"]}>
            <Header />
            <SegmentedTabsControl />
            {/* Task List */}
            {/* <TaskList
            tasks={tasks}
            selected={selected}
            setCompleted={setCompleted}
          /> */}
            {/* <Progress completed="" pendingCount={0} /> */}
          </LinearGradient>
        </ScrollView>
      </Animated.View>
    </GestureHandlerRootView>
  );
}
