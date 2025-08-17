import { PADDING_H, PALETTE } from "@/constants";
import { TaskListProps } from "@/types/task";
import { Ionicons } from "@expo/vector-icons";
import { memo } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import Animated, {
  FadeInDown,
  Layout,
  SlideInRight,
} from "react-native-reanimated";


const TaskListComponent = ({ tasks, selected, completed, setCompleted }: TaskListProps) => {
  //   const visible = useMemo(
  //   () =>
  //     tasks.filter((t) => t.status === selected && !completed.includes(t.id)),
  //   [tasks, completed, selected]
  // );

  // TODO: Memoize
  // const onMarkDone = (id: string) => {
  //   Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  //   setCompleted((prev) => [...prev, id]);
  // };

  return (
    <FlatList
    data={[]}
      // data={visible}
      // keyExtractor={(item) => item.id}
      contentContainerStyle={{ paddingHorizontal: PADDING_H, gap: 16 }}
      style={{ marginTop: 8 }}
      renderItem={({ item, index }) => (
        <Animated.View
          entering={SlideInRight.delay(80 * index).springify()}
          layout={Layout.springify()}
        >
          {/* <TaskCard task={item} onDone={() => onMarkDone(item.id)} /> */}
        </Animated.View>
      )}
      ListEmptyComponent={
        <Animated.View entering={FadeInDown.delay(80).springify()}>
          <View style={styles.emptyCard}>
            <Ionicons
              name="sparkles-outline"
              size={20}
              color={PALETTE.purple}
            />
            <Text style={styles.emptyText}>Nothing here. Enjoy your day!</Text>
          </View>
        </Animated.View>
      }
    />
  );
};

export const TaskList = memo(TaskListComponent);

const styles = StyleSheet.create({
  emptyCard: {
    marginHorizontal: PADDING_H,
    marginVertical: 8,
    borderRadius: 16,
    backgroundColor: "#FFF",
    padding: 16,
    borderWidth: 1,
    borderColor: PALETTE.border,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: { color: PALETTE.sub, fontWeight: "600" },
});
