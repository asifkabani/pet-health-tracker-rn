import { TabKey } from "./tab";

export type Task = {
  id: string;
  pet: string;
  title: string;
  subtitle: string;
  status: TabKey;
  dueInMinutes: number; // negative => overdue by |minutes|
  color: string;
  avatar: string;
};

export type TaskCardProps = {
  task: Task,
  onDone?: () => void
}

export type TaskListProps = {
  tasks: Task[],
  selected: TabKey,
  completed: Task[],
  setCompleted: Function,
}

