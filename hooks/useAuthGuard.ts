// hooks/useAuthGuard.ts
import { useAuthStore } from "@/store/auth";
import { useEffect } from "react";

type Options = {
  requireAuth?: boolean; // default true
  redirectAuthedTo?: string; // default "/(tabs)"
  redirectGuestTo?: string; // default "/(auth)/sign-in"
};

export function useAuthGuard(opts: Options = {}) {
  const {
    requireAuth = true,
    redirectAuthedTo = "/(tabs)",
    redirectGuestTo = "/(auth)/sign-in",
  } = opts;

  const { user, hydrated } = useAuthStore();

  useEffect(() => {
    if (!hydrated) return;
    if (requireAuth && !user) {
      console.log("Go back to sign in");
      //   router.replace(redirectGuestTo);
    } else if (!requireAuth && user) {
      //   router.replace(redirectAuthedTo);
      console.log("Go to home tabs");
    }
  }, [hydrated, user, requireAuth, redirectAuthedTo, redirectGuestTo]);

  return { ready: hydrated, user };
}

// Example Usage
// app/(tabs)/private-note.tsx

// import { View, Text } from "react-native";
// import { useAuthGuard } from "@/hooks/useAuthGuard";

// export default function PrivateNote() {
//   const { ready, user } = useAuthGuard({ requireAuth: true });
//   if (!ready) return null; // or a loader
//   return (
//     <View className="flex-1 items-center justify-center bg-white">
//       <Text className="text-slate-900 font-extrabold">
//         Hi {user?.name}, this is protected.
//       </Text>
//     </View>
//   );
// }
