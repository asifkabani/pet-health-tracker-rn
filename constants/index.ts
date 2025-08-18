import { TaskStatus } from "@/types/task";

export const PALETTE = {
  bg: "#FCFAFF",
  card: "#FFFFFF",
  text: "#171717",
  sub: "#6B7280",
  purple: "#7C3AED",
  blue: "#2563EB",
  green: "#16A34A",
  red: "#EF4444",
  border: "#F0ECF8",
};

export const TASK_LIST_CONTENT_CONTAINER_STYLE = {
  paddingHorizontal: 12,
  gap: 4,
};

export const PADDING_H = 20;
export const AVATAR_SIZE = 48;

export const INITIAL_TASKS = [
  {
    id: "1",
    pet: "Bella",
    title: "Bella's Medication",
    subtitle: "Heart medication - Morning dose",
    status: "overdue" as TaskStatus,
    dueInMinutes: -120,
    color: PALETTE.red,
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256&auto=format&fit=crop",
  },
  {
    id: "2",
    pet: "Max",
    title: "Max's Walk",
    subtitle: "Morning walk - 30 minutes",
    status: "today" as TaskStatus,
    dueInMinutes: 30,
    color: PALETTE.blue,
    avatar:
      "https://images.unsplash.com/photo-1547425260-76bcadfb4f2f?q=80&w=256&auto=format&fit=crop",
  },
  {
    id: "3",
    pet: "Bella",
    title: "Bella's Feeding",
    subtitle: "Lunch - Wet food with supplements",
    status: "today" as TaskStatus,
    dueInMinutes: 180,
    color: PALETTE.green,
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256&auto=format&fit=crop",
  },
  {
    id: "4",
    pet: "Both",
    title: "Grooming Appointment",
    subtitle: "Both pets - Nail trimming & bath",
    status: "upcoming" as TaskStatus,
    dueInMinutes: 300,
    color: PALETTE.purple,
    avatar:
      "https://images.unsplash.com/photo-1541534401786-2077eed87a72?q=80&w=256&auto=format&fit=crop",
  },
];
