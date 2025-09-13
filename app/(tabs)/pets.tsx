import * as Haptics from "expo-haptics";
import React, { useEffect, useState } from "react";
import { Button, FlatList, StatusBar, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, {
  FadeInDown,
  FadeInUp,
  Layout,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import PetHistory from "@/components/app/Pets/History/PetHistory";
import { PetHeader } from "@/components/app/Pets/PetHeader/PetHeader";
import { ProfileHeader } from "@/components/app/Pets/PetProfileHeader/PetProfileHeader";
import { PetTaskCard } from "@/components/app/Pets/PetTaskCard/PetTaskCard";
import { SegmentedTabsControl } from "@/components/shared/SegmentedTabs/SegmentedTabs";

import EmptyState from "@/components/ui/EmptyState";
import { usePetsPage } from "@/hooks/usePetsPage/usePetsPage";
import { useBadgeStore } from "@/store/badges";
import { usePetsStore } from "@/store/pets";
import { PetTask } from "@/types/pet";
import { router } from "expo-router";

const initialUpcoming: PetTask[] = [
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
  const [upcoming, setUpcoming] = useState<PetTask[]>(initialUpcoming);
  const [history, setHistory] = useState<PetTask[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const tabsValues = ["Upcoming", "History", "Records"];
  const pets = usePetsStore((s) => s.pets);

  const { pet } = usePetsPage();
  const { name, age, gender, weight, breed } = pet;

  // ---- Tab badge for "pets" route: show count of upcoming items
  const setTabBadge = useBadgeStore((s) => s.setTabBadge);
  useEffect(() => {
    setTabBadge("pets", upcoming.length);
  }, [upcoming.length, setTabBadge]);

  const onDone = (task: PetTask) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setUpcoming((prev) => prev.filter((t) => t.id !== task.id));
    setHistory((prev) => [{ ...task, chip: "Completed just now" }, ...prev]);
  };

  const onSnooze = (task: PetTask) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setUpcoming((prev) => {
      const rest = prev.filter((t) => t.id !== task.id);
      return [...rest, { ...task, chip: "Snoozed 1 hr" }];
    });
  };

  if (pets.length === 0) {
    return (
      <SafeAreaView className="flex-1">
        <GestureHandlerRootView>
          <View className="flex-1 bg-white">
            <EmptyState
              icon="add-circle-outline"
              title="No pets yet"
              subtitle="Add a pet to see reminders, history, and records here."
              cta={
                <Button
                  title="Add a pet"
                  onPress={() =>
                    router.push("/(onboarding)/pet-profile" as any)
                  }
                />
              }
            />
          </View>
        </GestureHandlerRootView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1">
      <GestureHandlerRootView>
        <View className="flex-1 bg-white">
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

          {/* Upcoming */}
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
                <Animated.View entering={FadeInUp.springify()}>
                  <EmptyState
                    icon="checkmark-done"
                    title="All caught up. 🎉"
                    subtitle="No upcoming items."
                    tone="success"
                    className="mx-4 mt-6"
                  />
                </Animated.View>
              }
            />
          )}

          {/* History (keeps your existing design, no duplicate header) */}
          {selectedIndex === 1 && <PetHistory />}

          {/* Records (placeholder — reuse EmptyState) */}
          {selectedIndex === 2 && (
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
                    rightIcon="checkmark-done"
                  />
                </Animated.View>
              )}
              ListEmptyComponent={
                <Animated.View entering={FadeInUp.springify()}>
                  <EmptyState
                    icon="document-text-outline"
                    title="No records yet."
                    subtitle="Add vaccinations, prescriptions, and PDFs."
                    tone="muted"
                    className="mx-4 mt-6"
                  />
                </Animated.View>
              }
            />
          )}
        </View>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}
