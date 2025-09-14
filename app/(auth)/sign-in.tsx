import { Ionicons } from "@expo/vector-icons";
import * as AppleAuthentication from "expo-apple-authentication";
import * as Google from "expo-auth-session/providers/google";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import OAuthButton from "@/components/ui/OAuthButton";
import TextField from "@/components/ui/TextField";
import { AuthUser, randId, useAuthStore } from "@/store/auth";
import Animated, { FadeIn } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

WebBrowser.maybeCompleteAuthSession();

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

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId:
      "177124050396-705o28t1cfeijhja8qt0f8i923vh8sc1.apps.googleusercontent.com",
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
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{ paddingBottom: 28 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Hero */}
          <LinearGradient
            colors={["#F1E9FF", "#E9F2FF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="py-6 px-6 pb-7"
          >
            <View className="flex-row justify-between mb-4">
              <View className="w-11 h-11 rounded-full bg-white items-center justify-center">
                <Ionicons name="paw" size={20} color="#7C3AED" />
              </View>
            </View>
            <Animated.Text
              entering={FadeIn.springify()}
              className="text-2xl font-black text-slate-900"
            >
              Create your account
            </Animated.Text>
            <Text className="text-slate-500 font-semibold mt-2">
              Keep your pets’ health, tasks, and records in one place.
            </Text>
          </LinearGradient>

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

            {/* <View className="mt-5">
            <Button
              title="Create Account"
              onPress={onCreate}
              loading={loading}
              left={<Ionicons name="paw" size={18} color="#fff" />}
              right={<Ionicons name="arrow-forward" size={18} color="#fff" />}
            />
          </View> */}
            <Pressable
              disabled={!valid || loading}
              onPress={onCreate}
              style={({ pressed }) => [
                styles.cta,
                (!valid || loading) && { opacity: 0.6 },
                pressed &&
                  valid && { opacity: 0.9, transform: [{ scale: 0.99 }] },
              ]}
            >
              <LinearGradient
                colors={["#7C3AED", "#6D28D9"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.ctaGrad}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Ionicons name="paw" size={18} color="#fff" />
                    <Text style={styles.ctaText}>Create Account</Text>
                    <Ionicons name="arrow-forward" size={18} color="#fff" />
                  </>
                )}
              </LinearGradient>
            </Pressable>

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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  cta: { marginTop: 18, height: 52, borderRadius: 14, overflow: "hidden" },
  ctaGrad: {
    flex: 1,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  ctaText: { color: "#FFF", fontWeight: "900", fontSize: 16 },
});
