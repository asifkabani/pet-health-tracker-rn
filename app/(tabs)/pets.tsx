import { PetHeader } from "@/components/app/Pets/PetHeader/PetHeader";
import { SegmentedTabsControl } from "@/components/shared/SegmentedTabs/SegmentedTabs";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo, useRef, useState } from "react";
import {
  FlatList,
  Pressable,
  ScrollView,
  StatusBar,
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
  FadeInUp,
  Layout,
  ZoomIn,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

/* ------------------------------------------------------------------ */

type TabKey = "upcoming" | "history" | "records";

type Task = {
  id: string;
  kind: "Medication" | "Grooming" | "Vet Appointment";
  detail: string;
  chip: string; // e.g. "Today 8:00 AM"
  dot: string; // left colored dot
  tint: string; // card border tint
};

const PALETTE = {
  bg: "#F7F5FF",
  text: "#0F172A",
  sub: "#6B7280",
  purple: "#6D28D9",
  purple2: "#7C3AED",
  blue: "#2563EB",
  green: "#16A34A",
  red: "#EF4444",
  border: "#EDEBFF",
  card: "#FFFFFF",
  chipBg: "#F3F4F6",
  shadow: "rgba(16,24,40,0.06)",
};

const initialUpcoming: Task[] = [
  {
    id: "t1",
    kind: "Medication",
    detail: "Heartworm prevention pill",
    chip: "Today 8:00 AM",
    dot: "#FB923C",
    tint: "#FFEAD8",
  },
  {
    id: "t2",
    kind: "Grooming",
    detail: "Nail trimming and bath",
    chip: "Tomorrow 2:00 PM",
    dot: "#3B82F6",
    tint: "#E7F0FF",
  },
  {
    id: "t3",
    kind: "Vet Appointment",
    detail: "Annual checkup and vaccinations",
    chip: "Next Week",
    dot: "#A855F7",
    tint: "#F3E8FF",
  },
];

/* ------------------------------------------------------------------ */

export default function PetScreen() {
  const [tab, setTab] = useState<TabKey>("upcoming");
  const [upcoming, setUpcoming] = useState<Task[]>(initialUpcoming);
  const [history, setHistory] = useState<Task[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const tabsValues = ["Upcoming", "History", "Records"];

  const counts = useMemo(
    () => ({
      upcoming: upcoming.length,
      history: history.length,
      records: 0,
    }),
    [upcoming, history]
  );

  const onDone = (task: Task) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setUpcoming((prev) => prev.filter((t) => t.id !== task.id));
    setHistory((prev) => [{ ...task, chip: "Completed just now" }, ...prev]);
  };

  const onSnooze = (task: Task) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // simple UX stub: push the item to the end and change the chip text
    setUpcoming((prev) => {
      const rest = prev.filter((t) => t.id !== task.id);
      return [...rest, { ...task, chip: "Snoozed 1 hr" }];
    });
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <PetHeader />
        <ProfileHeader />
        <SegmentedTabsControl
          tabsValues={tabsValues}
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
        />

        {selectedIndex === 0 && (
          <FlatList
            data={upcoming}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
            ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
            renderItem={({ item, index }) => (
              <Animated.View
                entering={FadeInDown.delay(index * 70).springify()}
                layout={Layout.springify()}
              >
                <TaskCard
                  task={item}
                  onDone={() => onDone(item)}
                  onSnooze={() => onSnooze(item)}
                />
              </Animated.View>
            )}
            ListEmptyComponent={
              <Animated.Text
                entering={FadeInUp.springify()}
                style={styles.empty}
              >
                All caught up. 🎉
              </Animated.Text>
            }
          />
        )}

        {selectedIndex === 1 && (
          <FlatList
            data={history}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
            ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
            renderItem={({ item, index }) => (
              <Animated.View
                entering={FadeInDown.delay(index * 60).springify()}
                layout={Layout.springify()}
              >
                <TaskCard
                  task={item}
                  disabled
                  doneLabel="Completed"
                  rightIcon="checkmark-done"
                />
              </Animated.View>
            )}
            ListEmptyComponent={
              <Animated.Text
                entering={FadeInUp.springify()}
                style={styles.empty}
              >
                No history yet.
              </Animated.Text>
            }
          />
        )}

        {selectedIndex === 2 && (
          <ScrollView
            contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
          >
            <Animated.View
              entering={FadeIn.springify()}
              style={styles.recordCard}
            >
              <Ionicons
                name="document-text-outline"
                size={22}
                color={PALETTE.purple}
              />
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.recordTitle}>
                  Upload vaccination record
                </Text>
                <Text style={styles.recordSub}>Tap to add a photo or PDF.</Text>
              </View>
            </Animated.View>
            <Animated.View
              entering={FadeIn.delay(120).springify()}
              style={styles.recordCard}
            >
              <Ionicons
                name="medkit-outline"
                size={22}
                color={PALETTE.purple}
              />
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.recordTitle}>Add a medication</Text>
                <Text style={styles.recordSub}>
                  Keep dosages and reminders together.
                </Text>
              </View>
            </Animated.View>
          </ScrollView>
        )}
      </View>
    </GestureHandlerRootView>
  );
}

/* ------------------------------------------------------------------ */
/* UI Blocks */
/* ------------------------------------------------------------------ */

function ProfileHeader() {
  const pulse = useSharedValue(1);
  React.useEffect(() => {
    pulse.value = withRepeat(withTiming(1.12, { duration: 900 }), -1, true);
  }, [pulse]);

  const heartStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  return (
    <View style={styles.profileWrap}>
      <Animated.View entering={ZoomIn.springify()} style={styles.avatarWrap}>
        <Image
          source="https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=300&auto=format&fit=crop"
          style={styles.avatar}
          contentFit="cover"
        />
        <Animated.View style={[styles.heartBadge, heartStyle]}>
          <Ionicons name="heart" size={16} color="#fff" />
        </Animated.View>
      </Animated.View>

      <Text style={styles.petName}>Buddy</Text>
      <Text style={styles.petSub}>Golden Retriever • Male</Text>

      <View style={styles.infoRow}>
        <View style={styles.infoPill}>
          <Ionicons name="calendar-clear-outline" size={16} color="#111827" />
          <Text style={styles.infoText}>3 years old</Text>
        </View>
        <View style={styles.infoPill}>
          <Ionicons name="card-outline" size={16} color="#111827" />
          <Text style={styles.infoText}>65 lbs</Text>
        </View>
      </View>
    </View>
  );
}

function Tabs({
  tab,
  counts,
  onChange,
}: {
  tab: TabKey;
  counts: Record<TabKey, number>;
  onChange: (k: TabKey) => void;
}) {
  const tabs: { key: TabKey; label: string }[] = [
    { key: "upcoming", label: "Upcoming" },
    { key: "history", label: "History" },
    { key: "records", label: "Records" },
  ];

  return (
    <View style={styles.tabsWrap}>
      {tabs.map((t) => {
        const active = tab === t.key;
        return (
          <Pressable
            key={t.key}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onChange(t.key);
            }}
            style={({ pressed }) => [
              styles.tabBtn,
              active && styles.tabBtnActive,
              pressed && { opacity: 0.9 },
            ]}
          >
            {active ? (
              <LinearGradient
                colors={["#7C3AED", "#6D28D9"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.tabGrad]}
              >
                <Text style={styles.tabTextActive}>{t.label}</Text>
              </LinearGradient>
            ) : (
              <Text style={styles.tabText}>{t.label}</Text>
            )}
            <View
              style={[styles.countDot, active && { backgroundColor: "#fff" }]}
            >
              <Text style={[styles.countTxt, active && { color: "#111827" }]}>
                {counts[t.key]}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

function TaskCard({
  task,
  onDone,
  onSnooze,
  disabled,
  doneLabel = "Done",
  rightIcon = "time-outline",
}: {
  task: Task;
  onDone?: () => void;
  onSnooze?: () => void;
  disabled?: boolean;
  doneLabel?: string;
  rightIcon?: keyof typeof Ionicons.glyphMap;
}) {
  const swipeRef = useRef<Swipeable | null>(null);

  return (
    <Swipeable
      ref={swipeRef}
      enabled={!disabled}
      renderLeftActions={() => (
        <View style={[styles.leftAction, { backgroundColor: PALETTE.green }]}>
          <Ionicons name="checkmark" size={22} color="#fff" />
          <Text style={{ color: "#fff", fontWeight: "700", marginTop: 4 }}>
            {doneLabel}
          </Text>
        </View>
      )}
      leftThreshold={50}
      onSwipeableOpen={() => {
        swipeRef.current?.close();
        onDone?.();
      }}
    >
      <View style={[styles.card, { borderColor: task.tint }]}>
        {/* header row */}
        <View style={styles.cardTopRow}>
          <View style={styles.leftTitle}>
            <View style={[styles.dot, { backgroundColor: task.dot }]} />
            <Text style={styles.cardTitle}>{task.kind}</Text>
          </View>

          <View style={[styles.chip, { backgroundColor: tintFrom(task.tint) }]}>
            <Text style={[styles.chipTxt, { color: textFrom(task.tint) }]}>
              {task.chip}
            </Text>
          </View>
        </View>

        <Text style={styles.cardSub}>{task.detail}</Text>

        <View style={styles.cardActions}>
          <Pressable
            disabled={disabled}
            onPress={() => onDone?.()}
            style={({ pressed }) => [
              styles.doneBtn,
              pressed && !disabled && { transform: [{ scale: 0.98 }] },
              disabled && { opacity: 0.8 },
            ]}
          >
            <Ionicons name="checkmark-outline" size={18} color="#fff" />
            <Text style={styles.doneTxt}>{doneLabel}</Text>
          </Pressable>

          <Pressable
            disabled={disabled}
            onPress={() => onSnooze?.()}
            style={({ pressed }) => [
              styles.snooze,
              pressed && !disabled && { opacity: 0.85 },
            ]}
          >
            <Ionicons name={rightIcon} size={18} color="#111827" />
          </Pressable>
        </View>
      </View>
    </Swipeable>
  );
}

/* ------------------------------------------------------------------ */
/* Helpers */
/* ------------------------------------------------------------------ */

function tintFrom(hex: string) {
  // simple lighten: use given pastel as chip bg
  return hex;
}
function textFrom(hex: string) {
  // darker text for light chips
  return "#1F2937";
}

/* ------------------------------------------------------------------ */
/* Styles */
/* ------------------------------------------------------------------ */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  /* Profile block */
  profileWrap: {
    marginTop: -64,
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  avatarWrap: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#fff",
    padding: 8,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  avatar: { width: "100%", height: "100%", borderRadius: 60 },
  heartBadge: {
    position: "absolute",
    right: 6,
    bottom: 6,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#22C55E",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  petName: {
    marginTop: 10,
    fontSize: 30,
    fontWeight: "900",
    color: PALETTE.text,
  },
  petSub: {
    marginTop: 4,
    color: PALETTE.sub,
    fontSize: 16,
    fontWeight: "600",
  },
  infoRow: {
    flexDirection: "row",
    marginTop: 10,
  },
  infoPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginHorizontal: 6,
    borderColor: "#EEF2FF",
    borderWidth: 1,
  },
  infoText: { marginLeft: 6, fontWeight: "700", color: "#111827" },

  /* Tabs */
  tabsWrap: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 6,
    marginTop: 10,
  },
  tabBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  tabBtnActive: {
    backgroundColor: "#fff",
  },
  tabGrad: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  tabText: { fontWeight: "800", color: "#374151", fontSize: 16 },
  tabTextActive: { fontWeight: "900", color: "#fff", fontSize: 16 },
  countDot: {
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    backgroundColor: "#E5E7EB",
  },
  countTxt: { fontSize: 12, fontWeight: "800", color: "#374151" },

  /* Cards */
  card: {
    backgroundColor: PALETTE.card,
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
  },
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftTitle: { flexDirection: "row", alignItems: "center" },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  cardTitle: { fontSize: 20, fontWeight: "800", color: PALETTE.text },
  chip: {
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipTxt: {
    fontWeight: "800",
  },
  cardSub: {
    marginTop: 10,
    color: PALETTE.sub,
    fontSize: 16,
    fontWeight: "600",
  },
  cardActions: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
  },
  doneBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: PALETTE.green,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  doneTxt: {
    color: "#fff",
    fontWeight: "900",
    marginLeft: 6,
    fontSize: 16,
  },
  snooze: {
    width: 48,
    height: 48,
    marginLeft: 10,
    borderRadius: 12,
    backgroundColor: "#F2F4F7",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ECECEC",
  },

  /* Records */
  recordCard: {
    borderWidth: 1,
    borderColor: "#EEF2FF",
    borderRadius: 14,
    padding: 14,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    marginBottom: 12,
  },
  recordTitle: { fontWeight: "800", color: "#111827", fontSize: 16 },
  recordSub: { color: PALETTE.sub, marginTop: 2 },

  empty: {
    textAlign: "center",
    marginTop: 24,
    color: PALETTE.sub,
    fontWeight: "700",
  },

  leftAction: {
    width: 90,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    marginRight: 8,
  },
});
