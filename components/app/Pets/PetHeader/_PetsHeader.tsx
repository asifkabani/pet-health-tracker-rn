import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { memo } from "react";
import { Pressable, Text, TouchableOpacity } from "react-native";

const RoundedIconButton = ({ iconName, text, onPress }: any) => {
  return (
    <TouchableOpacity
      className="bg-white/80 rounded-full w-10 h-10 justify-center items-center"
      onPress={onPress}
    >
      {iconName ? (
        <Ionicons name={iconName} size={20} color="#374151" />
      ) : (
        <Text>{text}</Text>
      )}
    </TouchableOpacity>
  );
};

const PetsHeaderComponent = () => {
  return (
    <LinearGradient
      colors={["#faf5ff", "#eff6ff"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="px-6 pt-12 pb-8 flex-row items-center justify-between"
    >
      <Ionicons.Button
        name="arrow-back"
        size={20}
        borderRadius={50}
        color="#374151"
        backgroundColor="white"
      />
      <Pressable className="px-4 py-2 bg-white/80 rounded-full text-sm font-medium text-gray-700 backdrop-blur-sm">
        Edit
      </Pressable>
    </LinearGradient>
  );
};

export const PetsHeader = memo(PetsHeaderComponent);
