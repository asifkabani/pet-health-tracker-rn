import { ProgressStatus } from "@/types/task";
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
    let bgColor, textColor, icon;

    switch (label) {
      case ProgressStatus.Completed:
        icon = "#16a34a";
        bgColor = "bg-green-100";
        textColor = "text-green-600";
        break;
      case ProgressStatus.Pending:
        icon = "#2563eb";
        bgColor = "bg-blue-100";
        textColor = "text-blue-600";
        break;
      case ProgressStatus.DayStreak:
        icon = "#ea580c";
        bgColor = "bg-orange-100";
        textColor = "text-orange-600";
        break;
      default:
        icon = "gray";
        bgColor = "gray";
        textColor = "gray";
        break;
    }

    return { bgColor, textColor, icon };
  };

  return (
    <BlurView
      intensity={20}
      tint="light"
      className="flex-1 bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-purple-100"
    >
      <View className="items-center gap-2">
        <View
          className={`w-14 h-14 ${getValueColor(label).bgColor} rounded-2xl mx-auto flex items-center justify-center mb-2`}
        >
          <Ionicons name={icon} size={20} color={getValueColor(label).icon} />
        </View>
        <Text
          className={`text-2xl font-bold ${getValueColor(label).textColor}`}
        >
          {value}
        </Text>
        <Text className="text-xs text-gray-500">{label}</Text>
      </View>
    </BlurView>
  );
};

export const ProgressTile = memo(ProgressTileComponent);
