import PetHistory from "@/components/app/Pets/History/PetHistory";
import { PetHeader } from "@/components/app/Pets/PetHeader/PetHeader";
import { ProfileHeader } from "@/components/app/Pets/PetProfileHeader/PetProfileHeader";
import { PetTaskCard } from "@/components/app/Pets/PetTaskCard/PetTaskCard";
import { SegmentedTabsControl } from "@/components/shared/SegmentedTabs/SegmentedTabs";
import { usePetsPage } from "@/hooks/usePetsPage/usePetsPage";
import { PetTask } from "@/types/pet";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import { FlatList, StatusBar, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, {
  FadeInDown,
  FadeInUp,
  Layout,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

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
  const { pet } = usePetsPage();
  const { name, age, gender, weight, breed } = pet;

  const onDone = (task: PetTask) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setUpcoming((prev) => prev.filter((t) => t.id !== task.id));
    setHistory((prev) => [{ ...task, chip: "Completed just now" }, ...prev]);
  };

  const onSnooze = (task: PetTask) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // simple UX stub: push the item to the end and change the chip text
    setUpcoming((prev) => {
      const rest = prev.filter((t) => t.id !== task.id);
      return [...rest, { ...task, chip: "Snoozed 1 hr" }];
    });
  };

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
                  className="text-center mt-6 color-gray-500 font-bold"
                >
                  All caught up. 🎉
                </Animated.Text>
              }
            />
          )}

          {selectedIndex === 1 && <PetHistory />}

          {/* {selectedIndex === 1 && (
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
                  className="text-center mt-6 color-gray-500 font-bold"
                >
                  No history yet.
                </Animated.Text>
              }
            />
          )} */}

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
                    // doneLabel="Completed"
                    rightIcon="checkmark-done"
                  />
                </Animated.View>
              )}
              ListEmptyComponent={
                <Animated.Text
                  entering={FadeInUp.springify()}
                  className="text-center mt-6 color-gray-500 font-bold"
                >
                  No records yet.
                </Animated.Text>
              }
            />
          )}
        </View>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}
