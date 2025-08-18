export type TaskStatus = "today" | "upcoming" | "overdue";

export type Task = {
  id: string;
  pet: string;
  title: string;
  subtitle: string;
  status: TaskStatus;
  dueInMinutes: number; // negative => overdue by |minutes|
  color: string;
  avatar: string;
};

export type TaskCardProps = {
  task: Task;
  onDone?: () => void;
};

export type TaskListProps = {
  tasks: Task[];
  selected: TaskStatus;
  completed: Task[];
  setCompleted: Function;
};
