// HomeScreen.tsx
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import React, { JSX, useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
  LayoutChangeEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  GestureHandlerRootView,
  Swipeable,
} from "react-native-gesture-handler";
import Animated, {
  FadeIn,
  FadeInDown,
  Layout,
  SlideInRight,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import "../../assets/css/global.css";

type TabKey = "today" | "upcoming" | "overdue";

type Task = {
  id: string;
  pet: string;
  title: string;
  subtitle: string;
  status: TabKey;
  dueInMinutes: number; // negative => overdue by |minutes|
  color: string;
  avatar: string;
};

const PALETTE = {
  bg: "#FCFAFF",
  card: "#FFFFFF",
  text: "#171717",
  sub: "#6B7280",
  purple: "#7C3AED",
  blue: "#2563EB",
  green: "#16A34A",
  red: "#EF4444",
  border: "#F0ECF8",
};

const PADDING_H = 20;
const AVATAR_SIZE = 48;

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

export default function HomeScreen(): JSX.Element {
  const [selected, setSelected] = useState<TabKey>("today");
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [completed, setCompleted] = useState<string[]>([]);
  const counts = useMemo(() => {
    const c: Record<TabKey, number> = { today: 0, upcoming: 0, overdue: 0 };
    tasks
      .filter((t) => !completed.includes(t.id))
      .forEach((t) => (c[t.status] += 1));
    return c;
  }, [tasks, completed]);

  // countdown update (every 30s)
  useEffect(() => {
    const t = setInterval(() => {
      setTasks((prev) =>
        prev.map((x) => ({ ...x, dueInMinutes: x.dueInMinutes - 0.5 }))
      );
    }, 30000);
    return () => clearInterval(t);
  }, []);

  const visible = useMemo(
    () =>
      tasks.filter((t) => t.status === selected && !completed.includes(t.id)),
    [tasks, completed, selected]
  );

  // segmented indicator animation (driven by onLayout)
  const [tabLayouts, setTabLayouts] = useState<
    Record<TabKey, { x: number; w: number }>
  >({
    today: { x: 0, w: 0 },
    upcoming: { x: 0, w: 0 },
    overdue: { x: 0, w: 0 },
  });
  const indicatorX = useSharedValue(0);
  const indicatorW = useSharedValue(0);

  const moveIndicator = (key: TabKey) => {
    const { x, w } = tabLayouts[key];
    indicatorX.value = withSpring(x, { damping: 20 });
    indicatorW.value = withSpring(w, { damping: 20 });
  };

  useEffect(() => {
    if (tabLayouts.today.w > 0) moveIndicator(selected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, tabLayouts]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
    width: indicatorW.value,
  }));

  const onTabLayout =
    (key: TabKey) =>
    (e: LayoutChangeEvent): void => {
      const { x, width } = e.nativeEvent.layout;
      setTabLayouts((prev) => ({ ...prev, [key]: { x, w: width } }));
    };

  const onMarkDone = (id: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setCompleted((prev) => [...prev, id]);
  };

  const pendingCount = counts.today + counts.upcoming + counts.overdue;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Animated.View style={styles.container} entering={FadeIn.duration(300)}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 48 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <Animated.View
            entering={FadeInDown.delay(50).springify()}
            style={styles.header}
          >
            <Text
              className="text-sm text-gray-700 font-medium"
              style={styles.dateText}
            >
              Tuesday, Jan 23
            </Text>
            <View style={styles.rowBetween}>
              <View style={{ flex: 1, paddingRight: 16 }}>
                <Text style={styles.h1}>Good morning, Sarah!</Text>
                <Text style={styles.tagline}>
                  Bella & Max are counting on you 🐾
                </Text>
              </View>
              <View style={styles.avatarWrap}>
                <Ionicons
                  name="notifications-outline"
                  size={22}
                  color={PALETTE.purple}
                />
              </View>
              <Image
                style={styles.profile}
                contentFit="cover"
                source="https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=200&auto=format&fit=crop"
              />
            </View>
          </Animated.View>

          {/* Segmented Control */}
          <Animated.View
            entering={FadeInDown.delay(120).springify()}
            style={styles.segment}
          >
            <View style={styles.segmentBg}>
              <Animated.View
                style={[styles.segmentIndicator, indicatorStyle]}
              />
              {tabs.map((t) => {
                const isActive = selected === t.key;
                const isOverdue = t.key === "overdue";
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
                          style={[
                            styles.countText,
                            isOverdue && { color: PALETTE.red },
                          ]}
                        >
                          {counts[t.key]}
                        </Text>
                      </View>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </Animated.View>

          {/* Task List */}
          <FlatList
            data={visible}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: PADDING_H, gap: 16 }}
            style={{ marginTop: 8 }}
            renderItem={({ item, index }) => (
              <Animated.View
                entering={SlideInRight.delay(80 * index).springify()}
                layout={Layout.springify()}
              >
                <TaskCard task={item} onDone={() => onMarkDone(item.id)} />
              </Animated.View>
            )}
            ListEmptyComponent={
              <Animated.View entering={FadeInDown.delay(80).springify()}>
                <View style={styles.emptyCard}>
                  <Ionicons
                    name="sparkles-outline"
                    size={20}
                    color={PALETTE.purple}
                  />
                  <Text style={styles.emptyText}>
                    Nothing here. Enjoy your day!
                  </Text>
                </View>
              </Animated.View>
            }
          />

          {/* Progress */}
          <Animated.View
            entering={FadeInDown.delay(150).springify()}
            style={{ paddingHorizontal: PADDING_H, marginTop: 24 }}
          >
            <Text style={styles.sectionTitle}>Today's Progress</Text>
            <View style={styles.progressGrid}>
              <ProgressTile
                icon={<Ionicons name="checkmark-circle" size={28} />}
                label="Completed"
                value={completed.length}
              />
              <ProgressTile
                icon={<Ionicons name="time-outline" size={28} />}
                label="Pending"
                value={pendingCount}
              />
              <ProgressTile
                icon={<Ionicons name="flame-outline" size={28} />}
                label="Day Streak"
                value={7}
              />
            </View>
          </Animated.View>
        </ScrollView>
      </Animated.View>
    </GestureHandlerRootView>
  );
}

/* ---------------------------- Components ---------------------------- */

function TaskCard({
  task,
  onDone,
}: {
  task: Task;
  onDone?: () => void;
}): JSX.Element {
  const swipeRef = useRef<Swipeable | null>(null);

  const minutesText = useMemo(() => {
    const m = Math.round(task.dueInMinutes);
    if (m < 0)
      return `Overdue by ${Math.abs(m)} ${Math.abs(m) === 1 ? "min" : "mins"}`;
    if (m < 60) return `Due in ${m} ${m === 1 ? "minute" : "minutes"}`;
    return `Due at ${formatFutureTime(m)}`;
  }, [task.dueInMinutes]);

  return (
    <Swipeable
      ref={swipeRef}
      renderLeftActions={() => (
        <View style={[styles.leftAction]}>
          <Ionicons name="checkmark-done" size={26} color="#fff" />
          <Text style={{ color: "white", fontWeight: "700", marginTop: 6 }}>
            Done
          </Text>
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
      <Animated.View entering={FadeInDown.springify()} style={styles.card}>
        {task.status === "overdue" && <View style={styles.overdueStripe} />}
        <View style={styles.row}>
          <Image source={task.avatar} style={styles.petAvatar} />
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>{task.title}</Text>
            <Text
              style={[
                styles.cardDue,
                task.status === "overdue" && {
                  color: PALETTE.red,
                  fontWeight: "700",
                },
              ]}
            >
              {minutesText}
            </Text>
            <Text style={styles.cardSub}>{task.subtitle}</Text>
          </View>

          <View style={styles.rightCol}>
            <Pressable
              onPress={() => {
                Haptics.selectionAsync();
                onDone?.();
              }}
              style={({ pressed }) => [
                styles.doneBtn,
                { backgroundColor: task.color },
                pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
              ]}
            >
              <Text style={styles.doneText}>Done</Text>
            </Pressable>

            <View style={styles.clockPill}>
              <Ionicons name="time-outline" size={14} color={PALETTE.blue} />
            </View>
          </View>
        </View>
      </Animated.View>
    </Swipeable>
  );
}

function ProgressTile({
  icon,
  label,
  value,
}: {
  icon: JSX.Element;
  label: string;
  value: number;
}): JSX.Element {
  return (
    <BlurView intensity={20} tint="light" style={styles.progressTile}>
      <View style={{ alignItems: "center", gap: 10 }}>
        {icon}
        <Text style={styles.progressValue}>{value}</Text>
        <Text style={styles.progressLabel}>{label}</Text>
      </View>
    </BlurView>
  );
}

/* ----------------------------- Helpers ------------------------------ */

function formatFutureTime(minutesFromNow: number): string {
  const now = new Date();
  const dt = new Date(now.getTime() + minutesFromNow * 60 * 1000);
  let h = dt.getHours();
  const m = dt.getMinutes();
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  const mm = m.toString().padStart(2, "0");
  return `${h}:${mm} ${ampm}`;
}

/* ------------------------------ Styles ------------------------------ */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: PALETTE.bg },
  header: { paddingHorizontal: PADDING_H, paddingTop: 16, paddingBottom: 10 },
  dateText: { color: PALETTE.sub, fontSize: 14, marginBottom: 4 },
  h1: { fontSize: 28, fontWeight: "800", color: PALETTE.text },
  tagline: { marginTop: 6, color: PALETTE.purple, fontWeight: "600" },
  rowBetween: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  avatarWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#F5EEFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  profile: { width: 42, height: 42, borderRadius: 21, backgroundColor: "#DDD" },

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

  card: {
    backgroundColor: PALETTE.card,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: PALETTE.border,
    overflow: "hidden",
  },
  overdueStripe: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 6,
    backgroundColor: PALETTE.red,
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
  },
  row: { flexDirection: "row", gap: 12 },
  petAvatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    marginRight: 4,
  },
  cardTitle: { fontSize: 20, fontWeight: "800", color: PALETTE.text },
  cardDue: { marginTop: 4, color: PALETTE.sub, fontWeight: "700" },
  cardSub: { marginTop: 6, color: PALETTE.sub },
  rightCol: { alignItems: "center", justifyContent: "space-between" },
  doneBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
  doneText: { color: "white", fontWeight: "800" },
  clockPill: {
    marginTop: 8,
    backgroundColor: "#E6EEFF",
    padding: 8,
    borderRadius: 12,
  },

  emptyCard: {
    marginHorizontal: PADDING_H,
    marginVertical: 8,
    borderRadius: 16,
    backgroundColor: "#FFF",
    padding: 16,
    borderWidth: 1,
    borderColor: PALETTE.border,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: { color: PALETTE.sub, fontWeight: "600" },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: PALETTE.text,
    marginBottom: 12,
  },
  progressGrid: {
    flexDirection: "row",
    gap: 14,
    justifyContent: "space-between",
  },
  progressTile: {
    flex: 1,
    paddingVertical: 18,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: PALETTE.border,
    alignItems: "center",
  },
  progressValue: { fontSize: 28, fontWeight: "900", color: PALETTE.purple },
  progressLabel: { color: PALETTE.sub, fontWeight: "700" },

  leftAction: {
    backgroundColor: PALETTE.green,
    borderRadius: 18,
    marginLeft: PADDING_H,
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
  },
});
