import { useStore } from "@/store";

export const useHomePage = () => {
  const timeOfDay = useStore((state) => state.timeOfDay);
  const date = useStore((state) => state.date);
  const userName = useStore((state) => state.userName);
  const pets = useStore((state) => state.pets);

  return {
    timeOfDay,
    date,
    userName,
    pets,
  };
};
