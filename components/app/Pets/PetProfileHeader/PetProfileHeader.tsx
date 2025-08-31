import { PetHeaderProps } from "@/types/pet";
import { toTitleCase } from "@/util/helpers";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  ZoomIn,
} from "react-native-reanimated";

export const ProfileHeader = ({
  name,
  age,
  gender,
  breed,
  weight,
}: PetHeaderProps) => {
  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(withTiming(1.12, { duration: 900 }), -1, true);
  }, [pulse]);

  const heartStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  return (
    <View className="-mt-16 items-center px-4 mb-3">
      <Animated.View
        entering={ZoomIn.springify()}
        className="w-24 h-24 rounded-full object-cover pet-avatar"
      >
        <Image
          source="https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=300&auto=format&fit=crop"
          className="w-24 h-24 rounded-full object-cover pet-avatar"
        />
        <Animated.View style={[styles.heartBadge, heartStyle]}>
          <View className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <Ionicons
              name="heart-sharp"
              size={20}
              className="text-white text-xs"
            />
          </View>
        </Animated.View>
      </Animated.View>

      <Text className="text-2xl font-bold text-gray-800 mb-1">{name}</Text>
      <Text className="text-gray-600 text-sm mb-2">
        {`${breed && toTitleCase(breed)}`} • {`${toTitleCase(gender)}`}
      </Text>

      <View className="flex-row items-center space-x-4">
        <View className="flex-row">
          <Ionicons
            name="calendar-sharp"
            size={16}
            className="text-sm text-gray-600 mr-1"
          />
          <Text className="text-sm text-gray-600">{`${age} years old`}</Text>
        </View>
        <View className="flex-row">
          <FontAwesome6
            name="weight-scale"
            size={16}
            className="text-sm text-gray-600 mr-1"
          />
          <Text className="text-sm text-gray-600">{`${weight} lbs`}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
});
