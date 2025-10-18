import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import * as AppleAuthentication from "expo-apple-authentication";
import * as Google from "expo-auth-session/providers/google";
import * as Haptics from "expo-haptics";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AUTH_STORAGE_KEY, ONBOARDING_STORAGE_KEY, ROOT_ROUTE_NAME } from "@/constants";
import { AuthUser } from "@/types/auth";
import { generateRandomId, normalizeEmail, trimText } from "@/util/helpers";

export function useAuthFlows() {
  const nav = useNavigation<any>();
  const [checking, setChecking] = useState(true);
  const [appleAvailable, setAppleAvailable] = useState(false);

  // Check existing session
  useEffect(() => {
    (async () => {
      try {
        const existing = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
        if (existing) {
          nav.reset({ index: 0, routes: [{ name: ROOT_ROUTE_NAME }] });
          return;
        }
      } finally {
        setChecking(false);
      }
    })();
  }, [nav]);

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

  // Google
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: "<YOUR_IOS_CLIENT_ID>.apps.googleusercontent.com",
    androidClientId: "<YOUR_ANDROID_CLIENT_ID>.apps.googleusercontent.com",
    webClientId: "<YOUR_WEB_CLIENT_ID>.apps.googleusercontent.com",
    scopes: ["profile", "email"],
  });

  useEffect(() => {
    (async () => {
      if (response?.type === "success") {
        try {
          const accessToken = response.authentication?.accessToken;
          if (!accessToken) return;
          const res = await fetch("https://www.googleapis.com/userinfo/v2/me", {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          const profile = await res.json();
          const user: AuthUser = {
            id: profile.id ?? generateRandomId(),
            name: profile.name ?? "Google User",
            email: normalizeEmail(profile.email ?? ""),
            avatarUrl: profile.picture ?? undefined,
            createdAt: new Date().toISOString(),
            provider: "google",
          };
          await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          nav.reset({ index: 0, routes: [{ name: ROOT_ROUTE_NAME }] });
        } catch (e) {
          console.error(e);
        }
      }
    })();
  }, [response, nav]);

  // Apple sign-in
  const signInWithApple = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      const fullName = `${credential.fullName?.givenName ?? ""} ${credential.fullName?.familyName ?? ""}`.trim();
      const user: AuthUser = {
        id: credential.user,
        name: fullName || "Apple User",
        email: normalizeEmail(credential.email ?? ""),
        createdAt: new Date().toISOString(),
        provider: "apple",
      };
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      nav.reset({ index: 0, routes: [{ name: ROOT_ROUTE_NAME }] });
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
    await AsyncStorage.setItem(ONBOARDING_STORAGE_KEY, "completed");
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    nav.reset({ index: 0, routes: [{ name: ROOT_ROUTE_NAME }] });
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

