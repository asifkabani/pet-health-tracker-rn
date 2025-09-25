import { TASK_LIST_CONTENT_CONTAINER_STYLE } from "@/constants";
import { TaskListProps } from "@/types/task";
import { memo, useMemo } from "react";
import { FlatList } from "react-native";
import { TaskCard } from "./TaskCard";
import { TaskListEmpty } from "./TaskListEmpty";

const TaskListComponent = ({ tasks, selectedIndex }: TaskListProps) => {
  const filteredTasks = useMemo(
    () =>
      tasks.filter((task) => {
        if (selectedIndex === 1) {
          return task.status !== "overdue";
        }

        if (selectedIndex === 2) {
          return task.status === "overdue";
        }

        return true;
      }),
    [selectedIndex]
  );

  return (
    <FlatList
      data={filteredTasks}
      keyExtractor={(item) => item.id}
      contentContainerStyle={TASK_LIST_CONTENT_CONTAINER_STYLE}
      renderItem={({ item }) => <TaskCard task={item} />}
      ListEmptyComponent={<TaskListEmpty />}
    />
  );
};

export const TaskList = memo(TaskListComponent);
