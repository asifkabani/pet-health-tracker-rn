import { memo } from "react";
import { Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { ProgressTile } from "../ProgressTile/ProgressTile";

type ProgressProps = {
  completed: string;
  pendingCount: number;
};

const ProgressComponent = ({ completed, pendingCount }: ProgressProps) => {
  return (
    <Animated.View
      entering={FadeInDown.delay(150).springify()}
      className="mt-1  bg-white/60 backdrop-blur-sm rounded-2xl p-6 mx-3 border border-purple-100"
    >
      <Text className="text-lg font-bold text-gray-800 mb-5">
        Today's Progress
      </Text>
      <View className="flex-row">
        <ProgressTile
          icon="checkmark-sharp"
          label="Completed"
          value={completed.length}
        />
        <ProgressTile icon="time-sharp" label="Pending" value={pendingCount} />
        <ProgressTile icon="flame-sharp" label="Day Streak" value={7} />
      </View>
    </Animated.View>
  );
};

export const Progress = memo(ProgressComponent);
