import { useStore } from "@/store";
import { Stack } from "expo-router";
import "../global.css";

export default function RootLayout() {
  const isLoggedIn = useStore((state) => state.isAuthenticated);

  return (
    <Stack>
      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen name="sign-in" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}
