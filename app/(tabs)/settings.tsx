import SignOutButton from "@/components/auth/SignOutButton";
import { useAuthStore } from "@/store/auth";
import React from "react";
import { Image, Text, View } from "react-native";

export default function Settings() {
  const { user } = useAuthStore();

  return (
    <View className="flex-1 bg-white p-4">
      <View className="items-center mt-2 mb-6">
        <Image
          source={{
            uri:
              user?.avatarUrl ??
              "https://ui-avatars.com/api/?background=ECEAFF&color=4422AA&name=" +
                encodeURIComponent(user?.name ?? "User"),
          }}
          className="w-20 h-20 rounded-full"
        />
        <Text className="text-2xl font-extrabold text-slate-900 mt-3">
          {user?.name ?? "User"}
        </Text>
        <Text className="text-slate-500 font-semibold mt-1">
          {user?.email ?? "—"}
        </Text>
      </View>

      <View className="gap-3">
        {/* other settings rows here ... */}
        <SignOutButton />
      </View>
    </View>
  );
}
