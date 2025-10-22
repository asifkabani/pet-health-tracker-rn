export enum TaskStatus {
  Today = "today",
  Upcoming = "upcoming",
  Overdue = "overdue",
}

export enum ProgressStatus {
  Completed = "Completed",
  Pending = "Pending",
  DayStreak = "Day Streak",
}

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
  selectedIndex: number;
};
