import { User } from "@/types/user";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type UserState = {
  users: User[];
  addUser: (user: User) => void;
  updateUser: (id: string, patch: Partial<User>) => void;
  removeUser: (id: string) => void;
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      users: [],
      addUser: (user) => set((state) => ({ users: [user, ...state.users] })),
      updateUser: (id, patch) =>
        set((state) => ({
          users: state.users.map((user) =>
            user.id === id ? { ...user, ...patch } : user
          ),
        })),
      removeUser: (id) =>
        set((state) => ({
          users: state.users.filter((user) => user.id !== id),
        })),
    }),
    { name: "@petcare/user", storage: createJSONStorage(() => AsyncStorage) }
  )
);
