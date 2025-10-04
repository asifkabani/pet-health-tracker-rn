import Button from "@/components/ui/Button";
import { usePetsStore } from "@/store/pets";
import { FontAwesome5 } from "@expo/vector-icons";
import { v4 as uuidv4 } from "uuid";

import { PetType } from "@/types/pet";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

export default function PetProfile() {
  const addPet = usePetsStore((s) => s.addPet);

  const [name, setName] = useState("");
  const [type, setType] = useState<PetType>("dog");
  const [breed, setBreed] = useState("");
  const [birthday, setBirthday] = useState("");

  const canContinue = name.trim().length > 0;

  const onContinue = () => {
    addPet({
      id: uuidv4(),
      name: name.trim(),
      type,
      breed: breed.trim() || undefined,
      birthday: birthday || undefined,
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.replace("/(onboarding)/first-reminder" as any);
  };

  return (
    <ScrollView className="bg-gray-50 min-h-screen">
      {/* Header */}
      <View className="px-4 pt-4">
        <Text className="text-lg font-semibold text-gray-900">Pet Profile</Text>
        <View className="mt-3 h-2 rounded-full bg-gray-200">
          <View className="h-2 w-1/2 rounded-full bg-indigo-500" />
        </View>
      </View>

      {/* Avatar placeholder */}
      <LinearGradient
        colors={["#6B73FF", "#9B59B6"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="w-32 h-32 rounded-full flex items-center justify-center mb-4 mt-4 mx-auto border-4 border-dashed border-white border-opacity-50"
      >
        <FontAwesome5
          name="camera"
          size={28}
          color="#fff"
          className="text-3xl opacity-60"
        />
      </LinearGradient>
      <Text className="text-center text-sm text-gray-500 mt-4">
        Tap to add your pet's photo
      </Text>

      {/* Form */}
      <View className="px-4 mt-6">
        <Text className="text-sm font-medium text-gray-700">Pet Name *</Text>
        <TextInput
          className="h-12 rounded-xl border border-indigo-50 bg-white px-3 text-slate-900"
          placeholder="Enter your pet's name"
          placeholderTextColor="#9CA3AF"
          value={name}
          onChangeText={setName}
        />

        <Text className="text-sm font-medium text-gray-700 mt-5 mb-2">
          Pet Type *
        </Text>
        <View className="flex-row gap-3">
          {(["dog", "cat", "other"] as PetType[]).map((k) => {
            const active = type === k;
            const label = k === "dog" ? "Dog" : k === "cat" ? "Cat" : "Other";
            const icon = k === "dog" ? "dog" : k === "cat" ? "cat" : "paw";
            return (
              <Pressable
                key={k}
                onPress={() => setType(k)}
                className={`flex-1 h-20 rounded-2xl border items-center justify-center ${active ? "border-indigo-400 bg-indigo-50" : "border-gray-200 bg-white"}`}
              >
                <FontAwesome5
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

        <Text className="text-sm font-medium text-gray-700 mt-5 mb-2">
          Breed (Optional)
        </Text>
        <TextInput
          className="h-12 rounded-xl border border-indigo-50 bg-white px-3 text-slate-900"
          placeholder="e.g., Golden Retriever"
          placeholderTextColor="#9CA3AF"
          value={breed}
          onChangeText={setBreed}
        />

        <Text className="text-sm font-medium text-gray-700 mt-5 mb-2">
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
