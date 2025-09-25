export interface User {
  id: string;
  name: string;
  email: string;
}

export type AuthUserProvider = "local" | "apple" | "google";

export interface AuthUser extends User {
  createdAt: string;
  avatarUrl?: string;
  provider?: AuthUserProvider;
}
