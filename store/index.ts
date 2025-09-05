import { create } from "zustand";

export interface Pet {
  name: string;
  birthdate: string;
  age: number;
  gender: string;
  type: string;
  breed?: string;
  weight: number;
  avatar?: string;
}

interface State {
  userName: string;
  timeOfDay: string;
  date: string;
  isAuthenticated: boolean;
  pets: Pet[];
}

const today = new Date().toLocaleDateString(undefined, {
  weekday: "long",
  month: "short",
  day: "numeric",
});

export const useStore = create<State>()((set) => ({
  userName: "asif",
  timeOfDay: "morning",
  date: today,
  isAuthenticated: false,
  pets: [
    {
      name: "Moon",
      birthdate: "February 22, 2022",
      age: 3,
      gender: "female",
      type: "dog",
      breed: "pitbull",
      weight: 70,
    },
  ],
}));
