import { Task } from "@/types/task";

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

export const toTitleCase = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
