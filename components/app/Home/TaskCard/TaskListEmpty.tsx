import { PALETTE } from "@/constants";
import { useTaskStore } from "@/store/tasks";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export const TaskListEmpty = () => {
  const { addTask } = useTaskStore();
  const handleAddTask = () => {
    router.push("/(onboarding)/first-reminder");
  };

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

      <View style={styles.cardActions}>
        <Pressable
          onPress={handleAddTask}
          style={({ pressed }) => [
            styles.doneBtn,
            pressed && { transform: [{ scale: 0.98 }] },
          ]}
        >
          <Text style={styles.doneTxt}>Add Task</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardActions: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
  },
  doneBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: PALETTE.green,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  doneTxt: {
    color: "#fff",
    fontWeight: "900",
    marginLeft: 6,
    fontSize: 16,
  },
});
