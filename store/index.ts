import { create } from "zustand";

interface Pet {
  name: string;
  birthdate: string;
  age: number;
  gender: string;
  type: string;
  weight: number;
  avatar: string | null;
}

interface State {
  userName: string;
  timeOfDay: string;
  date: string;
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
  pets: [
    {
      name: "Moon",
      birthdate: "February 22, 2022",
      age: 3,
      gender: "female",
      type: "pitbull",
      weight: 70,
      avatar: null,
    },
  ],
}));
