import { AUTH_STORAGE_KEY, ROOT_ROUTE_NAME } from "@/constants";
import { useStore } from "@/store";
import { AuthUser } from "@/types/auth";
import { generateRandomId, normalizeEmail, trimText } from "@/util/helpers";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as AppleAuthentication from "expo-apple-authentication";
import { makeRedirectUri } from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useEffect, useState } from "react";

export function useAuthFlows() {
  const [checking, setChecking] = useState(true);
  const [appleAvailable, setAppleAvailable] = useState(false);
  const setAuthenticated = useStore((s) => s.setAuthenticated);

  // Check existing session
  useEffect(() => {
    (async () => {
      try {
        const existing = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
        if (existing) {
          try {
            setAuthenticated(true);
          } catch {}
          router.replace(`/${ROOT_ROUTE_NAME}`);
          return;
        }
      } finally {
        setChecking(false);
      }
    })();
  }, []);

  // Apple availability
  useEffect(() => {
    let active = true;
    AppleAuthentication.isAvailableAsync()
      .then((available) => active && setAppleAvailable(available))
      .catch(() => active && setAppleAvailable(false));
    return () => {
      active = false;
    };
  }, []);

  // Google (Expo Web)
  const redirectUri = makeRedirectUri({ native: undefined });
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId:
      "177124050396-g2i5s93k8vacg6f461ghcab18g6ethd6.apps.googleusercontent.com",
    scopes: ["profile", "email", "openid"],
    responseType: "id_token",
    redirectUri,
  });

  useEffect(() => {
    (async () => {
      if (response?.type === "success") {
        try {
          // Debug: inspect response on web
          console.log("Google redirectUri", redirectUri);
          console.log("Google response", response);
        } catch {}
        try {
          // Prefer id_token on web implicit flow
          const idToken = (response as any)?.params?.id_token as
            | string
            | undefined;
          if (!idToken) return;
          const res = await fetch(
            `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`
          );
          const profile = await res.json();
          const user: AuthUser = {
            id: (profile?.sub as string) ?? generateRandomId(),
            name: (profile?.name as string) ?? "Google User",
            email: normalizeEmail((profile?.email as string) ?? ""),
            avatarUrl: (profile?.picture as string) ?? undefined,
            createdAt: new Date().toISOString(),
            provider: "google",
          };
          await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
          try {
            setAuthenticated(true);
          } catch {}
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          router.replace(`/${ROOT_ROUTE_NAME}`);
        } catch (e) {
          console.error(e);
        }
      }
    })();
  }, [response]);

  // Apple sign-in
  const signInWithApple = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      const fullName =
        `${credential.fullName?.givenName ?? ""} ${credential.fullName?.familyName ?? ""}`.trim();
      const user: AuthUser = {
        id: credential.user,
        name: fullName || "Apple User",
        email: normalizeEmail(credential.email ?? ""),
        createdAt: new Date().toISOString(),
        provider: "apple",
      };
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      try {
        setAuthenticated(true);
      } catch {}
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace(`/${ROOT_ROUTE_NAME}`);
    } catch (e: any) {
      if (e?.code === "ERR_CANCELED") return;
      console.error(e);
    }
  };

  // Local account creation
  const createLocalAccount = async (name: string, email: string) => {
    const user: AuthUser = {
      id: generateRandomId(),
      name: trimText(name),
      email: normalizeEmail(email),
      createdAt: new Date().toISOString(),
      provider: "local",
    };
    await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    try {
      setAuthenticated(true);
    } catch {}
    // await AsyncStorage.setItem(ONBOARDING_STORAGE_KEY, "completed");
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.replace(`/${ROOT_ROUTE_NAME}`);
  };

  return {
    checking,
    appleAvailable,
    signInWithApple,
    request,
    response,
    promptAsync,
    createLocalAccount,
  };
}
