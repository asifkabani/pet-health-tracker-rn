import { TASK_COLOR } from "@/constants";
import { ProgressStatus, Task, TaskStatus } from "@/types/task";

function formatFutureTime(minutesFromNow: number): string {
  const now = new Date();
  const dt = new Date(now.getTime() + minutesFromNow * 60 * 1000);
  let h = dt.getHours();
  const m = dt.getMinutes();
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  const mm = m.toString().padStart(2, "0");
  return `${h}:${mm} ${ampm}`;
}

export const minutesText = (task: Task): string => {
  const m = Math.round(task.dueInMinutes);
  if (m < 0)
    return `Overdue by ${Math.abs(m)} ${Math.abs(m) === 1 ? "min" : "mins"}`;
  if (m < 60) return `Due in ${m} ${m === 1 ? "minute" : "minutes"}`;
  return `Due at ${formatFutureTime(m)}`;
};

export const getTaskColor = (status: TaskStatus) => {
  if (status === TaskStatus.Overdue) {
    return TASK_COLOR[TaskStatus.Overdue];
  }

  return TASK_COLOR.default;
};

export const getValueColor = (label: string) => {
  let bgColor, textColor, icon;

  switch (label) {
    case ProgressStatus.Completed:
      icon = "#16a34a";
      bgColor = "bg-green-100";
      textColor = "text-green-600";
      break;
    case ProgressStatus.Pending:
      icon = "#2563eb";
      bgColor = "bg-blue-100";
      textColor = "text-blue-600";
      break;
    case ProgressStatus.DayStreak:
      icon = "#ea580c";
      bgColor = "bg-orange-100";
      textColor = "text-orange-600";
      break;
    default:
      icon = "gray";
      bgColor = "gray";
      textColor = "gray";
      break;
  }

  return { bgColor, textColor, icon };
};

export const toTitleCase = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const tintFrom = (hex: string) => hex;
export const textFrom = (hex: string) => "#1F2937";

export function generateRandomId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export const normalizeEmail = (email: string) => email.trim().toLowerCase();
export const trimText = (value: string) => value.trim();
export const isValidEmail = (email: string) =>
  /\S+@\S+\.\S+/.test(normalizeEmail(email));
