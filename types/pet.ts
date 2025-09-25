import { Ionicons } from "@expo/vector-icons";
import { PetTask } from "./task";

export enum Gender {
  Male = "Male",
  Female = "Female",
}

export type PetType = "dog" | "cat" | "other";

export interface Pet {
  id: string;
  name: string;
  birthdate: string;
  age: number;
  gender: Gender;
  type: PetType;
  breed?: string;
  weight: number;
  avatar?: string;
}

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
