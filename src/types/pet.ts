import { Ionicons } from "@expo/vector-icons";

export type PetTask = {
  id: string;
  kind: "Medication" | "Grooming" | "Vet Appointment";
  detail: string;
  chip: string; // e.g. "Today 8:00 AM"
  dot: string; // left colored dot
  tint: string; // card border tint
};

export type PetHeaderProps = {
  name: string;
  age: number;
  gender: string;
  weight: number;
  breed?: string;
};

export type PetTaskCardProps = {
  task: PetTask;
  onDone?: () => void;
  onSnooze?: () => void;
  disabled?: boolean;
  rightIcon?: keyof typeof Ionicons.glyphMap;
};
