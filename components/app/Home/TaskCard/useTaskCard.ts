import { Task } from "@/types/task";
import { minutesText } from "@/util";
import { useMemo } from "react";

export const useTaskCard = (task: Task) => {
  const memoizedMinutesText = useMemo(() => {
    return minutesText(task);
  }, [task]);

  return {
    memoizedMinutesText,
  };
};
