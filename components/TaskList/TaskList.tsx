import { INITIAL_TASKS, TASK_LIST_CONTENT_CONTAINER_STYLE } from "@/constants";
import { memo } from "react";
import { FlatList } from "react-native";
import { TaskCard } from "../TaskCard/TaskCard";
import { TaskListEmpty } from "./TaskListEmpty";

const TaskListComponent = ({
  tasks,
  selected,
  completed,
  setCompleted,
}: any) => {
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
      data={INITIAL_TASKS}
      keyExtractor={(task) => task.id}
      contentContainerStyle={TASK_LIST_CONTENT_CONTAINER_STYLE}
      renderItem={({ item, index }) => <TaskCard task={item} />}
      ListEmptyComponent={<TaskListEmpty />}
    />
  );
};

export const TaskList = memo(TaskListComponent);
