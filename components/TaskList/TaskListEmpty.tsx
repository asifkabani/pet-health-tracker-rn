import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

export const TaskListEmpty = () => {
  return (
    <View>
      <View className="mx-5 my-2 rounded-2xl bg-white p-4 border-1 border-purple-100 flex-row gap-2 items-center justify-center">
        <Ionicons
          name="sparkles-outline"
          size={20}
          className="text-purple-600"
        />
        <Text className="text-gray-500 font-semibold">
          Nothing here. Enjoy your day!
        </Text>
      </View>
    </View>
  );
};
