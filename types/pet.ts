import { Ionicons } from "@expo/vector-icons";

export enum Gender {
  Male = "Male",
  Female = "Female",
}

export type PetKind = "dog" | "cat" | "other";

export interface Pet {
  id: string;
  name: string;
  birthdate: string;
  age: number;
  gender: Gender;
  type: PetKind;
  breed?: string;
  weight: number;
  avatar?: string;
}

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
