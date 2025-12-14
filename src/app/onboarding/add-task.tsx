import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { JSX, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

type TaskType = "medication" | "vet" | "grooming" | "other";

const taskTypes: {
  key: TaskType;
  label: string;
  icon: keyof typeof FontAwesome5.glyphMap;
}[] = [
  { key: "medication", label: "Medication", icon: "pills" },
  { key: "vet", label: "Vet Visit", icon: "stethoscope" },
  { key: "grooming", label: "Grooming", icon: "cut" },
  { key: "other", label: "Other", icon: "list" },
];

export default function AddTaskScreen(): JSX.Element {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [taskName, setTaskName] = useState("");
  const [selectedType, setSelectedType] = useState<TaskType | null>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [reminder, setReminder] = useState(true);
  const [showPremium, setShowPremium] = useState(false);

  const canContinue = useMemo(
    () => taskName.trim().length > 0 && !!selectedType,
    [taskName, selectedType]
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 140 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="border-b border-gray-100 px-6 pb-4 pt-6">
            <View className="flex-row items-center justify-between">
              <Pressable
                className="p-2"
                onPress={() => router.back()}
                hitSlop={12}
              >
                <Ionicons name="chevron-back" size={22} color="#9CA3AF" />
              </Pressable>
              <Text className="text-lg font-semibold text-gray-900">
                Add Task
              </Text>
              <View className="w-8" />
            </View>
          </View>

          {/* Progress */}
          <View className="bg-white px-6 py-4">
            <View className="mb-2 flex-row items-center justify-between">
              <Text className="text-sm font-semibold text-[#6B73FF]">
                Step 2 of 2
              </Text>
              <Text className="text-sm text-gray-500">Create Task</Text>
            </View>
            <View className="h-2 w-full rounded-full bg-gray-200">
              <View
                className="h-2 rounded-full bg-[#6B73FF]"
                style={{ width: "100%" }}
              />
            </View>
          </View>

          {/* Content */}
          <View className="px-6 pb-10 pt-6">
            <View className="space-y-6">
              <View className="space-y-2">
                <Text className="text-sm font-medium text-gray-700">
                  Task Name *
                </Text>
                <TextInput
                  value={taskName}
                  onChangeText={setTaskName}
                  placeholder="e.g., Heartworm pill"
                  placeholderTextColor="#9CA3AF"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base text-gray-900"
                />
              </View>

              <View className="space-y-3">
                <Text className="text-sm font-medium text-gray-700">
                  Task Type *
                </Text>
                <View className="flex-row flex-wrap gap-3">
                  {taskTypes.map((type) => {
                    const active = selectedType === type.key;
                    return (
                      <TouchableOpacity
                        key={type.key}
                        activeOpacity={0.9}
                        onPress={() => setSelectedType(type.key)}
                        className={`items-center rounded-xl border-2 p-4 ${active ? "border-[#6B73FF] bg-[#EEF2FF]" : "border-gray-200 bg-white"}`}
                        style={{ flexGrow: 1, flexBasis: "45%" }}
                      >
                        <FontAwesome5
                          name={type.icon}
                          size={20}
                          color={active ? "#6B73FF" : "#9CA3AF"}
                          style={{ marginBottom: 6 }}
                        />
                        <Text
                          className={`text-sm font-medium ${active ? "text-[#2D2F7F]" : "text-gray-600"}`}
                        >
                          {type.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              <View className="space-y-2">
                <Text className="text-sm font-medium text-gray-700">Date</Text>
                <TextInput
                  value={date}
                  onChangeText={setDate}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#9CA3AF"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base text-gray-900"
                  keyboardType="numbers-and-punctuation"
                />
              </View>

              <View className="space-y-2">
                <Text className="text-sm font-medium text-gray-700">Time</Text>
                <TextInput
                  value={time}
                  onChangeText={setTime}
                  placeholder="HH:MM"
                  placeholderTextColor="#9CA3AF"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base text-gray-900"
                  keyboardType="numbers-and-punctuation"
                />
              </View>

              <View className="space-y-2">
                <View className="flex-row items-center justify-between">
                  <Text className="text-sm font-medium text-gray-700">
                    Reminder
                  </Text>
                  <Switch
                    value={reminder}
                    onValueChange={setReminder}
                    thumbColor={reminder ? "#fff" : "#f4f3f4"}
                    trackColor={{ false: "#D1D5DB", true: "#6B73FF" }}
                  />
                </View>
                <Text className="text-xs text-gray-500">
                  Send a push reminder for this task
                </Text>
              </View>

              <View className="space-y-2">
                <Text className="text-sm font-medium text-gray-700">Notes</Text>
                <TextInput
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="Add any details your vet shared"
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={4}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base text-gray-900"
                  textAlignVertical="top"
                />
              </View>
            </View>

            {/* Add another task */}
            <View className="mt-10">
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => setShowPremium(true)}
                className="w-full flex-row items-center justify-center rounded-xl border-2 border-dashed border-gray-300 py-4"
              >
                <Ionicons name="add" size={18} color="#6B73FF" />
                <Text className="ml-2 font-semibold text-[#6B73FF]">
                  Add Another Task
                </Text>
                <Text className="ml-3 rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">
                  Free: 5 tasks max
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Bottom action bar */}
        <View
          className="border-t border-gray-100 bg-white px-6 pb-4 pt-3"
          style={{ paddingBottom: Math.max(insets.bottom, 16) }}
        >
          <TouchableOpacity
            activeOpacity={0.9}
            disabled={!canContinue}
            className={`w-full items-center rounded-xl py-4 ${canContinue ? "bg-[#6B73FF]" : "bg-gray-300"}`}
          >
            <Text className="font-semibold text-white">Continue</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Premium modal */}
      <Modal
        transparent
        visible={showPremium}
        animationType="fade"
        onRequestClose={() => setShowPremium(false)}
      >
        <Pressable
          className="flex-1 items-center justify-center bg-black/50 px-4"
          onPress={() => setShowPremium(false)}
        >
          <Pressable
            className="w-full rounded-2xl bg-white p-6"
            onPress={(e) => e.stopPropagation()}
            style={{ transform: [{ translateY: -8 }], maxWidth: 380 }}
          >
            <View className="items-center">
              <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-[#6B73FF]">
                <Ionicons name="notifications" size={26} color="#fff" />
              </View>
              <Text className="text-xl font-bold text-gray-900">
                Unlock Unlimited Tasks
              </Text>
              <Text className="mt-1 text-center text-sm text-gray-600">
                Track all your reminders and tasks without limits
              </Text>
            </View>

            <View className="mt-6 space-y-3">
              {[
                "Unlimited tasks",
                "Smart reminders",
                "Calendar sync",
                "Priority support",
              ].map((item) => (
                <View key={item} className="flex-row items-center">
                  <Ionicons
                    name="checkmark-circle"
                    size={18}
                    color="#2ECC71"
                    style={{ marginRight: 10 }}
                  />
                  <Text className="text-sm text-gray-700">{item}</Text>
                </View>
              ))}
            </View>

            <View className="mt-6 space-y-3">
              <TouchableOpacity
                activeOpacity={0.9}
                className="w-full rounded-xl bg-[#6B73FF] py-3"
              >
                <Text className="text-center font-semibold text-white">
                  Upgrade Now - $4.99/month
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => setShowPremium(false)}
              >
                <Text className="text-center font-medium text-gray-500">
                  Maybe Later
                </Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
