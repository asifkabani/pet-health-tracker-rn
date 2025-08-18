import { TASK_LIST_CONTENT_CONTAINER_STYLE } from "@/constants";
import { TaskListProps } from "@/types/task";
import { memo } from "react";
import { FlatList } from "react-native";
import { TaskCard } from "../TaskCard/TaskCard";
import { TaskListEmpty } from "./TaskListEmpty";

const TaskListComponent = ({
  tasks = [],
  selected,
  completed,
  setCompleted,
}: TaskListProps) => {
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
      data={tasks}
      keyExtractor={(item) => item.id}
      contentContainerStyle={TASK_LIST_CONTENT_CONTAINER_STYLE}
      renderItem={({ item }) => <TaskCard task={item} />}
      ListEmptyComponent={<TaskListEmpty />}
    />
  );
};

export const TaskList = memo(TaskListComponent);
