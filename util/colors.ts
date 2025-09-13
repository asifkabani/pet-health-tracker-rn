import { ProgressStatus, TaskStatus } from "@/types/task";

export const TASK_COLOR = {
  error: {
    bgColor: "bg-red-50",
    borderColor: "border-red-400",
    avatarBorder: "border-red-200",
    minsText: "text-red-600",
    doneBtn: "bg-red-500",
    iconBgColor: "bg-red-100",
    iconTextColor: "#dc2626",
  },
  default: {
    bgColor: "bg-white/80",
    borderColor: "border-purple-100",
    avatarBorder: "border-blue-200",
    minsText: "text-blue-600",
    doneBtn: "bg-blue-500",
    iconBgColor: "bg-blue-100",
    iconTextColor: "#2563eb",
  },
};

export const tintFrom = (hex: string) => hex;
export const textFrom = (hex: string) => "#1F2937";

export const getTaskColor = (status: TaskStatus) => {
  if (status === TaskStatus.Overdue) {
    return TASK_COLOR.error;
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
