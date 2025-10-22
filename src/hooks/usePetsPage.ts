import { useStore } from "@/store";

export const usePetsPage = () => {
  const pet = useStore((state) => state.pets[0]);

  return {
    pet,
  };
};
