import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { JSX, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

type PetTypeKey = "dog" | "cat" | "other";

const petTypes: {
  key: PetTypeKey;
  label: string;
  icon: keyof typeof FontAwesome5.glyphMap;
}[] = [
  { key: "dog", label: "Dog", icon: "dog" },
  { key: "cat", label: "Cat", icon: "cat" },
  { key: "other", label: "Other", icon: "paw" },
];

export default function AddPetScreen(): JSX.Element {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [petName, setPetName] = useState("");
  const [selectedType, setSelectedType] = useState<PetTypeKey | null>(null);
  const [breed, setBreed] = useState("");
  const [birthday, setBirthday] = useState("");
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [showPremium, setShowPremium] = useState(false);

  const canContinue = useMemo(
    () => petName.trim().length > 0 && !!selectedType,
    [petName, selectedType]
  );

  const togglePhoto = () => {
    if (photoUri) {
      setPhotoUri(null);
      return;
    }
    setPhotoUri(
      "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg"
    );
  };

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
                Pet Profile
              </Text>
              <View className="w-8" />
            </View>
          </View>

          {/* Progress */}
          <View className="bg-white px-6 py-4">
            <View className="mb-2 flex-row items-center justify-between">
              <Text className="text-sm font-semibold text-[#6B73FF]">
                Step 1 of 2
              </Text>
              <Text className="text-sm text-gray-500">Setup Profile</Text>
            </View>
            <View className="h-2 w-full rounded-full bg-gray-200">
              <View
                className="h-2 rounded-full bg-[#6B73FF]"
                style={{ width: "50%" }}
              />
            </View>
          </View>

          {/* Content */}
          <View className="px-6 pb-10 pt-6">
            {/* Photo upload */}
            <View className="items-center">
              <View className="relative">
                <Pressable
                  onPress={togglePhoto}
                  className="h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-dashed border-white/60 bg-[#6B73FF]"
                  style={{
                    shadowColor: "#6B73FF",
                    shadowOpacity: 0.25,
                    shadowRadius: 10,
                    shadowOffset: { width: 0, height: 6 },
                  }}
                >
                  {photoUri ? (
                    <Image
                      source={{ uri: photoUri }}
                      className="h-full w-full"
                      contentFit="cover"
                    />
                  ) : (
                    <Ionicons name="camera" size={32} color="#EEF2FF" />
                  )}
                </Pressable>
                <View className="absolute -bottom-3 left-1/2 -translate-x-1/2">
                  <View className="h-10 w-10 items-center justify-center rounded-full bg-[#FF6B9D] shadow-lg">
                    <Ionicons name="add" size={18} color="#fff" />
                  </View>
                </View>
              </View>
              <Text className="mt-6 text-sm text-gray-500">
                Tap to add your pet&apos;s photo
              </Text>
            </View>

            {/* Form */}
            <View className="mt-8 space-y-6">
              <View className="space-y-2">
                <Text className="text-sm font-medium text-gray-700">
                  Pet Name *
                </Text>
                <TextInput
                  value={petName}
                  onChangeText={setPetName}
                  placeholder="Enter your pet's name"
                  placeholderTextColor="#9CA3AF"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base text-gray-900"
                />
              </View>

              <View className="space-y-3">
                <Text className="text-sm font-medium text-gray-700">
                  Pet Type *
                </Text>
                <View className="flex-row flex-wrap gap-3">
                  {petTypes.map((type) => {
                    const active = selectedType === type.key;
                    return (
                      <TouchableOpacity
                        key={type.key}
                        activeOpacity={0.9}
                        onPress={() => setSelectedType(type.key)}
                        className={`items-center rounded-xl border-2 p-4 ${active ? "border-[#6B73FF] bg-[#EEF2FF]" : "border-gray-200 bg-white"}`}
                        style={{ flex: 1, minWidth: "30%" }}
                      >
                        <FontAwesome5
                          name={type.icon}
                          size={22}
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
                <Text className="text-sm font-medium text-gray-700">
                  Breed (Optional)
                </Text>
                <TextInput
                  value={breed}
                  onChangeText={setBreed}
                  placeholder="e.g., Golden Retriever"
                  placeholderTextColor="#9CA3AF"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base text-gray-900"
                />
              </View>

              <View className="space-y-2">
                <Text className="text-sm font-medium text-gray-700">
                  Birthday (Optional)
                </Text>
                <TextInput
                  value={birthday}
                  onChangeText={setBirthday}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#9CA3AF"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base text-gray-900"
                  keyboardType="numbers-and-punctuation"
                />
              </View>
            </View>

            {/* Add another pet */}
            <View className="mt-10">
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => setShowPremium(true)}
                className="w-full flex-row items-center justify-center rounded-xl border-2 border-dashed border-gray-300 py-4"
              >
                <Ionicons name="add" size={18} color="#6B73FF" />
                <Text className="ml-2 font-semibold text-[#6B73FF]">
                  Add Another Pet
                </Text>
                <Text className="ml-3 rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">
                  Free: 2 pets max
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
              <LinearGradient
                colors={["#FF6B9D", "#9B59B6"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 9999,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 16,
                }}
              >
                <Ionicons name="pricetag" size={28} color="#fff" />
              </LinearGradient>
              <Text className="text-xl font-bold text-gray-900">
                Unlock Unlimited Care
              </Text>
              <Text className="mt-1 text-center text-sm text-gray-600">
                Add unlimited pets and get premium features
              </Text>
            </View>

            <View className="mt-6 space-y-3">
              {[
                "Unlimited pets",
                "Email & SMS reminders",
                "Unlimited health records",
                "Premium support",
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
