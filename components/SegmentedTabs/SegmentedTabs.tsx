import { PADDING_H, PALETTE } from "@/constants";
import { TabKey } from "@/types/tab";
import { Task } from "@/types/task";
import * as Haptics from "expo-haptics";
import { memo, useEffect, useMemo, useState } from "react";
import {
    LayoutChangeEvent,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import Animated, {
    FadeInDown,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";

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

const tabs: { key: TabKey; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "upcoming", label: "Upcoming" },
  { key: "overdue", label: "Overdue" },
];

const SegmentedTabs = () => {
  const [selected, setSelected] = useState<TabKey>("today");
  const [completed, setCompleted] = useState<string[]>([]);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const indicatorX = useSharedValue(0);
  const indicatorW = useSharedValue(0);

  const moveIndicator = (key: TabKey) => {
    const { x, w } = tabLayouts[key];
    indicatorX.value = withSpring(x, { damping: 20 });
    indicatorW.value = withSpring(w, { damping: 20 });
  };

  const [tabLayouts, setTabLayouts] = useState<
    Record<TabKey, { x: number; w: number }>
  >({
    today: { x: 0, w: 0 },
    upcoming: { x: 0, w: 0 },
    overdue: { x: 0, w: 0 },
  });

  const onTabLayout =
    (key: TabKey) =>
    (e: LayoutChangeEvent): void => {
      const { x, width } = e.nativeEvent.layout;
      setTabLayouts((prev) => ({ ...prev, [key]: { x, w: width } }));
    };

  const counts = useMemo(() => {
    const c: Record<TabKey, number> = { today: 0, upcoming: 0, overdue: 0 };
    tasks
      .filter((t) => !completed.includes(t.id))
      .forEach((t) => (c[t.status] += 1));
    return c;
  }, [tasks, completed]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
    width: indicatorW.value,
  }));

  const renderTabs = tabs.map((t) => {
    const isActive = selected === t.key;
    const isOverdue = t.key === "overdue";

    useEffect(() => {
      if (tabLayouts.today.w > 0) moveIndicator(selected);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selected, tabLayouts]);

    return (
      <Pressable
        key={t.key}
        onLayout={onTabLayout(t.key)}
        onPress={() => {
          setSelected(t.key);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }}
        style={styles.segmentBtn}
      >
        <View style={styles.rowCenter}>
          <Text
            style={[
              styles.segmentLabel,
              isActive && {
                color: isOverdue ? PALETTE.red : PALETTE.purple,
              },
              isOverdue && !isActive && { color: "#B91C1C" },
            ]}
          >
            {t.label}
          </Text>
          <View
            style={[
              styles.countPill,
              isOverdue && { backgroundColor: "#FEE2E2" },
            ]}
          >
            <Text
              style={[styles.countText, isOverdue && { color: PALETTE.red }]}
            >
              {counts[t.key]}
            </Text>
          </View>
        </View>
      </Pressable>
    );
  });

  return (
    <Animated.View
      entering={FadeInDown.delay(120).springify()}
      style={styles.segment}
    >
      <View style={styles.segmentBg}>
        <Animated.View style={[styles.segmentIndicator, indicatorStyle]} />
        {renderTabs}
      </View>
    </Animated.View>
  );
};

export const SegmentedTabsControl = memo(SegmentedTabs)

const styles = StyleSheet.create({
  segment: { paddingHorizontal: PADDING_H, paddingVertical: 12 },
  segmentBg: {
    flexDirection: "row",
    backgroundColor: "#F8F5FF",
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    position: "relative",
  },
  segmentBtn: { flex: 1, alignItems: "center" },
  rowCenter: { flexDirection: "row", alignItems: "center", gap: 8 },
  segmentLabel: { fontWeight: "800", color: "#6B21A8", fontSize: 16 },
  countPill: {
    backgroundColor: "#F0E8FF",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  countText: { color: PALETTE.purple, fontWeight: "800" },
  segmentIndicator: {
    position: "absolute",
    height: 40,
    borderRadius: 12,
    left: 12,
    top: 6,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
});
