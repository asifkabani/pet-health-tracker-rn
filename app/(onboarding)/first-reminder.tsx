import Button from "@/components/ui/Button";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";

type ReminderKind = "vet" | "medication" | "vaccine" | "grooming" | "custom";

export default function FirstReminder() {
  const [kind, setKind] = useState<ReminderKind | null>(null);
  const [date, setDate] = useState("01/15/2024");
  const [time, setTime] = useState("09:00 AM");
  const [frequency, setFrequency] = useState<
    "once" | "daily" | "weekly" | "monthly"
  >("once");

  const canSave = !!kind;

  const saveReminder = () => {
    // You can push this into a tasks/reminders store later.
    router.replace("/(tabs)"); // go to app after onboarding
  };

  const chips: {
    key: ReminderKind;
    title: string;
    sub: string;
    color: string;
    icon: keyof typeof Ionicons.glyphMap;
  }[] = [
    {
      key: "vet",
      title: "Vet Visit",
      sub: "Annual checkup or appointment",
      color: "#EAF0FF",
      icon: "medkit-outline",
    },
    {
      key: "medication",
      title: "Medication",
      sub: "Daily pills or treatments",
      color: "#ECFDF5",
      icon: "bandage-outline",
    },
    {
      key: "vaccine",
      title: "Vaccination",
      sub: "Yearly shots and boosters",
      color: "#FEF9C3",
      icon: "shield-checkmark-outline",
    },
    {
      key: "grooming",
      title: "Grooming",
      sub: "Bath, nail trim, or haircut",
      color: "#FCE7F3",
      icon: "cut-outline",
    },
    {
      key: "custom",
      title: "Custom Task",
      sub: "Create your own reminder",
      color: "#E5E7EB",
      icon: "add-outline",
    },
  ];

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{ paddingBottom: 24 }}
    >
      <View className="px-4 pt-4">
        <Text className="text-2xl font-bold text-gray-900">
          Let's set your first reminder
        </Text>
        <Text className="text-gray-600 mt-2">
          Choose a task type to get started.
        </Text>
      </View>

      <View className="px-4 mt-5">
        <Text className="text-lg font-semibold text-gray-900 mb-3">
          What would you like to be reminded about?
        </Text>
        {chips.map((c) => {
          const active = kind === c.key;
          return (
            <Pressable
              key={c.key}
              onPress={() => setKind(c.key)}
              className={`rounded-2xl border mb-3 flex-row items-center p-4 ${active ? "border-indigo-400 bg-indigo-50" : "border-gray-200 bg-white"}`}
            >
              <View
                className="w-11 h-11 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: c.color }}
              >
                <Ionicons name={c.icon} size={18} color="#1F2937" />
              </View>
              <View className="flex-1">
                <Text className="text-slate-900 font-extrabold">{c.title}</Text>
                <Text className="text-slate-500 font-semibold mt-1">
                  {c.sub}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      {/* Simple date/time/frequency (no native pickers to avoid extra deps) */}
      <View className="px-4 mt-2">
        <Text className="text-slate-900 font-extrabold mb-2">
          When should we remind you?
        </Text>
        <View className="rounded-2xl border border-gray-200 p-3">
          <Text className="text-slate-900 font-extrabold">Date</Text>
          <TextInput
            className="h-12 rounded-xl border border-indigo-50 px-3 mt-2"
            value={date}
            onChangeText={setDate}
          />
          <Text className="text-slate-900 font-extrabold mt-3">Time</Text>
          <TextInput
            className="h-12 rounded-xl border border-indigo-50 px-3 mt-2"
            value={time}
            onChangeText={setTime}
          />
        </View>

        <Text className="text-slate-900 font-extrabold mt-4 mb-2">
          How often?
        </Text>
        <View className="flex-row gap-3 flex-wrap">
          {(["once", "daily", "weekly", "monthly"] as const).map((f) => (
            <Pressable
              key={f}
              onPress={() => setFrequency(f)}
              className={`px-4 h-12 rounded-xl border items-center justify-center ${frequency === f ? "border-indigo-400 bg-indigo-50" : "border-gray-200 bg-white"}`}
            >
              <Text
                className={`font-extrabold ${frequency === f ? "text-indigo-600" : "text-slate-600"}`}
              >
                {f === "once" ? "One-time" : f[0].toUpperCase() + f.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View className="px-4 mt-6">
        <Button
          title="Save Reminder"
          onPress={saveReminder}
          disabled={!canSave}
        />
      </View>
    </ScrollView>
  );
}
