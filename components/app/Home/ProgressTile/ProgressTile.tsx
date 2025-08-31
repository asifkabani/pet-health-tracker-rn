import { getValueColor } from "@/util/helpers";
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
  const { bgColor, textColor, icon: iconColor } = getValueColor(label);

  return (
    <BlurView
      intensity={20}
      tint="light"
      className="flex-1 bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-purple-100"
    >
      <View className="items-center gap-2">
        <View
          className={`w-14 h-14 ${bgColor} rounded-2xl mx-auto flex items-center justify-center mb-2`}
        >
          <Ionicons name={icon} size={20} color={iconColor} />
        </View>
        <Text className={`text-2xl font-bold ${textColor}`}>{value}</Text>
        <Text className="text-xs text-gray-500">{label}</Text>
      </View>
    </BlurView>
  );
};

export const ProgressTile = memo(ProgressTileComponent);
