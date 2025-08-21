import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { memo } from "react";
import { Text, View } from "react-native";

type ProgressTileProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: number;
};

const ProgressTileComponent = ({ icon, label, value }: ProgressTileProps) => {
  const getValueColor = (label: string) => {
    switch (label) {
      case "Completed":
        return "green";
      case "Pending":
        return "blue";
      case "Day Streak":
        return "orange";
      default:
        return "gray";
    }
  };

  const getValueIconColor = (label: string) => {
    switch (label) {
      case "Completed":
        return "#16a34a";
      case "Pending":
        return "#2563eb";
      case "Day Streak":
        return "#ea580c";
      default:
        return "gray";
    }
  };

  return (
    <BlurView
      intensity={20}
      tint="light"
      className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-purple-100"
    >
      <View style={{ alignItems: "center", gap: 10 }}>
        <View
          className={`w-16 h-16 bg-${getValueColor(label)}-100 rounded-2xl mx-auto flex items-center justify-center mb-2`}
        >
          <Ionicons name={icon} size={28} color={getValueIconColor(label)} />
        </View>
        <Text className={`text-2xl font-bold text-${getValueColor(label)}-600`}>
          {value}
        </Text>
        <Text className="text-xs text-gray-500">{label}</Text>
      </View>
    </BlurView>
  );
};

export const ProgressTile = memo(ProgressTileComponent);
