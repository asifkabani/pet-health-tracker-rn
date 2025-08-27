import { PetHeader } from "@/components/app/Pets/PetHeader/PetHeader";
import { ProfileHeader } from "@/components/app/Pets/PetProfileHeader/PetProfileHeader";
import { PetTaskCard } from "@/components/app/Pets/PetTaskCard/PetTaskCard";
import { SegmentedTabsControl } from "@/components/shared/SegmentedTabs/SegmentedTabs";
import { usePetsPage } from "@/hooks/usePetsPage/usePetsPage";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  FlatList,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  Layout,
} from "react-native-reanimated";

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

export default function PetScreen() {
  const [upcoming, setUpcoming] = useState<Task[]>(initialUpcoming);
  const [history, setHistory] = useState<Task[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const tabsValues = ["Upcoming", "History", "Records"];
  const { pet } = usePetsPage();
  const { name, age, gender, weight, breed } = pet;

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
        <ProfileHeader
          name={name}
          age={age}
          gender={gender}
          weight={weight}
          breed={breed}
        />
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
                <PetTaskCard
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
                <PetTaskCard
                  task={item}
                  disabled
                  // doneLabel="Completed"
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

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
