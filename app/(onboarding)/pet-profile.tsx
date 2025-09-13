import Button from "@/components/ui/Button";
import { useOnboardingStore } from "@/store/onboarding";
import { makeId, PetKind, usePetsStore } from "@/store/pets";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { cssInterop } from "nativewind";
import React, { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

const LG = cssInterop(LinearGradient, { className: "style" });

export default function PetProfile() {
  const addPet = usePetsStore((s) => s.addPet);
  const setSkip = useOnboardingStore((s) => s.setSkipPetOnboarding);

  const [name, setName] = useState("");
  const [kind, setKind] = useState<PetKind>("dog");
  const [breed, setBreed] = useState("");
  const [birthday, setBirthday] = useState(""); // keep simple mm/dd/yyyy

  const canContinue = name.trim().length > 0;

  const onContinue = () => {
    const petId = makeId();
    addPet({
      id: petId,
      name: name.trim(),
      kind,
      breed: breed.trim() || undefined,
      birthday: birthday || undefined,
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.replace("/(onboarding)/first-reminder" as any);
  };

  const onSkip = () => {
    setSkip(true);
    router.replace("/(tabs)");
  };

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{ paddingBottom: 24 }}
    >
      {/* Header */}
      <View className="px-4 pt-4">
        <Text className="text-2xl font-extrabold text-slate-900">
          Pet Profile
        </Text>
        <View className="mt-3 h-2 rounded-full bg-gray-200">
          <View className="h-2 w-1/2 rounded-full bg-indigo-500" />
        </View>
      </View>

      {/* Avatar placeholder */}
      <LG
        colors={["#A78BFA", "#60A5FA"]}
        className="mx-auto mt-6 h-36 w-36 rounded-full items-center justify-center"
      >
        <Ionicons name="camera-outline" size={28} color="#fff" />
      </LG>
      <Text className="text-center text-slate-500 font-semibold mt-2">
        Tap to add your pet’s photo
      </Text>

      {/* Form */}
      <View className="px-4 mt-6">
        <Text className="text-slate-900 font-extrabold mb-2">Pet Name *</Text>
        <TextInput
          className="h-12 rounded-xl border border-indigo-50 bg-white px-3 text-slate-900"
          placeholder="Enter your pet's name"
          placeholderTextColor="#9CA3AF"
          value={name}
          onChangeText={setName}
        />

        <Text className="text-slate-900 font-extrabold mt-5 mb-2">
          Pet Type *
        </Text>
        <View className="flex-row gap-3">
          {(["dog", "cat", "other"] as PetKind[]).map((k) => {
            const active = kind === k;
            const label = k === "dog" ? "Dog" : k === "cat" ? "Cat" : "Other";
            const icon =
              k === "dog"
                ? "paw"
                : k === "cat"
                  ? "logo-octocat"
                  : "paw-outline";
            return (
              <Pressable
                key={k}
                onPress={() => setKind(k)}
                className={`flex-1 h-20 rounded-2xl border items-center justify-center ${active ? "border-indigo-400 bg-indigo-50" : "border-gray-200 bg-white"}`}
              >
                <Ionicons
                  name={icon as any}
                  size={18}
                  color={active ? "#4F46E5" : "#6B7280"}
                />
                <Text
                  className={`mt-2 font-extrabold ${active ? "text-indigo-600" : "text-slate-600"}`}
                >
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text className="text-slate-900 font-extrabold mt-5 mb-2">
          Breed (Optional)
        </Text>
        <TextInput
          className="h-12 rounded-xl border border-indigo-50 bg-white px-3 text-slate-900"
          placeholder="e.g., Golden Retriever"
          placeholderTextColor="#9CA3AF"
          value={breed}
          onChangeText={setBreed}
        />

        <Text className="text-slate-900 font-extrabold mt-5 mb-2">
          Birthday (Optional)
        </Text>
        <TextInput
          className="h-12 rounded-xl border border-indigo-50 bg-white px-3 text-slate-900"
          placeholder="mm/dd/yyyy"
          placeholderTextColor="#9CA3AF"
          value={birthday}
          onChangeText={setBirthday}
          keyboardType={
            Platform.OS === "ios" ? "numbers-and-punctuation" : "numeric"
          }
        />

        <Pressable onPress={onSkip} className="mt-6 items-center">
          <Text className="text-slate-500 font-extrabold">Skip for now</Text>
        </Pressable>

        <View className="mt-4">
          <Button
            title="Continue"
            onPress={onContinue}
            disabled={!canContinue}
          />
        </View>
      </View>
    </ScrollView>
  );
}
