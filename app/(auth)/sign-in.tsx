import { Ionicons } from "@expo/vector-icons";
import * as AppleAuthentication from "expo-apple-authentication";
import * as Google from "expo-auth-session/providers/google";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { cssInterop } from "nativewind";
import React, { useEffect, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";

import Button from "@/components/ui/Button";
import OAuthButton from "@/components/ui/OAuthButton";
import TextField from "@/components/ui/TextField";
import { AuthUser, randId, useAuthStore } from "@/store/auth";

WebBrowser.maybeCompleteAuthSession();
const LG = cssInterop(LinearGradient, { className: "style" });

export default function SignIn() {
  // local form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user, hydrated, signIn } = useAuthStore();

  // If already signed in (layout also handles this, but this keeps page snappy on back nav)
  useEffect(() => {
    if (hydrated && user) router.replace("/(tabs)");
  }, [hydrated, user]);

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
        const token = response.authentication?.accessToken;
        if (!token) return;
        const res = await fetch("https://www.googleapis.com/userinfo/v2/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const p = await res.json();
        const u: AuthUser = {
          id: p.id ?? randId(),
          name: p.name ?? "Google User",
          email: (p.email ?? "").toLowerCase(),
          avatarUrl: p.picture ?? undefined,
          createdAt: new Date().toISOString(),
          provider: "google",
        };
        signIn(u);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        router.replace("/(tabs)");
      }
    })();
  }, [response]);

  // Apple
  const onApple = async () => {
    try {
      const cred = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      const fullName =
        `${cred.fullName?.givenName ?? ""} ${cred.fullName?.familyName ?? ""}`.trim();

      const u: AuthUser = {
        id: cred.user,
        name: fullName || "Apple User",
        email: (cred.email ?? "").toLowerCase(),
        createdAt: new Date().toISOString(),
        provider: "apple",
      };
      signIn(u);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace("/(tabs)");
    } catch (e: any) {
      if (e?.code === "ERR_CANCELED") return;
      console.warn(e);
    }
  };

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "What's your name?";
    if (!/^\S+@\S+\.\S+$/.test(email)) e.email = "Enter a valid email.";
    if (pwd.length < 6) e.pwd = "Min 6 characters.";
    return e;
  }, [name, email, pwd]);
  const valid = Object.keys(errors).length === 0;

  const onCreate = async () => {
    if (!valid) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    setLoading(true);
    try {
      const u: AuthUser = {
        id: randId(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        createdAt: new Date().toISOString(),
        provider: "local",
      };
      signIn(u);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace("/(tabs)");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={{ paddingBottom: 28 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Hero */}
        <LG
          className="px-5 pt-6 pb-7"
          colors={["#F1E9FF", "#E9F2FF"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View className="w-11 h-11 rounded-full bg-white items-center justify-center">
            <Ionicons name="paw" size={20} color="#7C3AED" />
          </View>
          <Text className="text-3xl font-extrabold text-slate-900 mt-4">
            Create your account
          </Text>
          <Text className="text-slate-500 font-semibold mt-2">
            Keep your pets’ health, tasks, and records in one place.
          </Text>
        </LG>

        {/* Card */}
        <View className="-mt-3 mx-4 rounded-2xl border border-indigo-50 bg-white p-4">
          <TextField
            label="Full Name"
            value={name}
            onChangeText={setName}
            placeholder="e.g., Sarah Johnson"
            error={errors.name}
            autoCapitalize="words"
          />
          <TextField
            label="Email"
            containerClassName="mt-4"
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            error={errors.email}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextField
            label="Password"
            containerClassName="mt-4"
            value={pwd}
            onChangeText={setPwd}
            placeholder="•••••••"
            error={errors.pwd}
            autoCapitalize="none"
            secureTextEntry={!showPwd}
          />
          <Text
            onPress={() => setShowPwd((s) => !s)}
            className="text-indigo-600 font-extrabold mt-2"
          >
            {showPwd ? "Hide password" : "Show password"}
          </Text>

          <View className="mt-5">
            <Button
              title="Create Account"
              onPress={onCreate}
              loading={loading}
              left={<Ionicons name="paw" size={18} color="#fff" />}
              right={<Ionicons name="arrow-forward" size={18} color="#fff" />}
            />
          </View>

          {/* Divider */}
          <View className="flex-row items-center gap-3 my-4">
            <View className="flex-1 h-[1px] bg-indigo-50" />
            <Text className="text-slate-500 font-bold">or</Text>
            <View className="flex-1 h-[1px] bg-indigo-50" />
          </View>

          {/* OAuth */}
          {Platform.OS === "ios" && (
            <View className="mb-2">
              <AppleAuthentication.AppleAuthenticationButton
                buttonType={
                  AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN
                }
                buttonStyle={
                  AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
                }
                cornerRadius={12}
                style={{ width: "100%", height: 48 }}
                onPress={onApple}
              />
            </View>
          )}

          <OAuthButton provider="google" onPress={() => promptAsync()} />
        </View>

        <View className="items-center mt-3">
          <Text className="text-slate-500">
            Already have an account?{" "}
            <Text className="text-indigo-600 font-extrabold">Sign in</Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
