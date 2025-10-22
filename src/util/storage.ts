import AsyncStorage from "@react-native-async-storage/async-storage";

export const STORAGE_USER = "@petcare:user";
export type AuthUser = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  avatarUrl?: string;
  provider?: "local" | "apple" | "google";
};

export async function getUser(): Promise<AuthUser | null> {
  const raw = await AsyncStorage.getItem(STORAGE_USER);
  return raw ? (JSON.parse(raw) as AuthUser) : null;
}

export async function saveUser(user: AuthUser) {
  await AsyncStorage.setItem(STORAGE_USER, JSON.stringify(user));
  await AsyncStorage.setItem("@petcare:onboarding", "completed");
}

export async function clearUser() {
  await AsyncStorage.multiRemove([STORAGE_USER, "@petcare:onboarding"]);
}

export const randId = () =>
  Math.random().toString(36).slice(2) + Date.now().toString(36);
