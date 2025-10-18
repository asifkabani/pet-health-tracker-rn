export type AuthProvider = "local" | "apple" | "google";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  avatarUrl?: string;
  provider?: AuthProvider;
};

export type SignInFormErrors = Partial<
  Record<"name" | "email" | "password" | "agree", string>
>;
