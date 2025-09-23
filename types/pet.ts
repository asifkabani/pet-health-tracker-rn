import { Ionicons } from "@expo/vector-icons";

enum Sex {
  Male = "Male",
  Female = "Female",
}

export type Pet = {
  id: number;
  name: string;
  type: string;
  breed?: string;
  birthday?: string;
  weight?: number;
  sex?: Sex;
};

export type PetTask = {
  id: string;
  kind: "Medication" | "Grooming" | "Vet Appointment";
  detail: string;
  chip: string;
  dot: string;
  tint: string;
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
