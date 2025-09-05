import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import * as AppleAuthentication from "expo-apple-authentication";
import * as Google from "expo-auth-session/providers/google";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import * as WebBrowser from "expo-web-browser";
import React, { JSX, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

WebBrowser.maybeCompleteAuthSession();

type NewUser = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  avatarUrl?: string;
  provider?: "local" | "apple" | "google";
};

const STORAGE_KEY = "@petcare:user";
// Adjust to your Home route (e.g. "(tabs)" or "Home")
const ROOT_ROUTE = "(tabs)";

const PALETTE = {
  bg: "#FFFFFF",
  text: "#0F172A",
  sub: "#6B7280",
  line: "#EEF2FF",
  purpleA: "#7C3AED",
  purpleB: "#6D28D9",
  green: "#16A34A",
  danger: "#EF4444",
};

export default function SignUpScreen(): JSX.Element {
  const nav = useNavigation<any>();

  const [checking, setChecking] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);

  // -------- Redirect to Home if user already exists --------
  useEffect(() => {
    (async () => {
      try {
        const existing = await AsyncStorage.getItem(STORAGE_KEY);
        if (existing) {
          nav.reset({ index: 0, routes: [{ name: ROOT_ROUTE }] });
          return;
        }
      } finally {
        setChecking(false);
      }
    })();
  }, [nav]);

  // -------- Google Auth (set your client IDs) --------
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

          const user: NewUser = {
            id: profile.id ?? randId(),
            name: profile.name ?? "Google User",
            email: (profile.email ?? "").toLowerCase(),
            avatarUrl: profile.picture ?? undefined,
            createdAt: new Date().toISOString(),
            provider: "google",
          };

          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(user));
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          nav.reset({ index: 0, routes: [{ name: ROOT_ROUTE }] });
        } catch (e) {
          console.error(e);
          Alert.alert("Google sign-in failed", "Please try again.");
        }
      }
    })();
  }, [response, nav]);

  // -------- Local form validation --------
  const errors = useMemo(() => {
    const e: Partial<Record<"name" | "email" | "password" | "agree", string>> =
      {};
    if (!name.trim()) e.name = "What's your name?";
    if (!/^\S+@\S+\.\S+$/.test(email)) e.email = "Enter a valid email.";
    if (password.length < 6) e.password = "Min 6 characters.";
    if (!agree) e.agree = "Please agree to the terms.";
    return e;
  }, [name, email, password, agree]);

  const valid = Object.keys(errors).length === 0;

  const handleCreate = async () => {
    if (!valid) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    try {
      setLoading(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const user: NewUser = {
        id: randId(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        createdAt: new Date().toISOString(),
        provider: "local",
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      await AsyncStorage.setItem("@petcare:onboarding", "completed");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      nav.reset({ index: 0, routes: [{ name: ROOT_ROUTE }] });
    } catch (err) {
      console.error(err);
      Alert.alert("Save failed", "Please try again.");
    } finally {
      setLoading(false);
    }
  };

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

      const user: NewUser = {
        id: credential.user,
        name: fullName || "Apple User",
        email: (credential.email ?? "").toLowerCase(),
        createdAt: new Date().toISOString(),
        provider: "apple",
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      nav.reset({ index: 0, routes: [{ name: ROOT_ROUTE }] });
    } catch (e: any) {
      if (e?.code === "ERR_CANCELED") return;
      console.error(e);
      Alert.alert("Apple sign-in failed", "Please try again.");
    }
  };

  if (checking) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          bounces={false}
          contentContainerStyle={{ paddingBottom: 36 }}
          keyboardShouldPersistTaps="handled"
        >
          <LinearGradient
            colors={["#F1E9FF", "#E9F2FF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="py-6 px-6 pb-7"
          >
            <View className="flex-row justify-between mb-4">
              <View style={styles.logoCircle}>
                <Ionicons name="paw" size={22} color={PALETTE.purpleA} />
              </View>
            </View>
            <Animated.Text
              entering={FadeIn.springify()}
              className="text-2xl font-black text-slate-900"
            >
              Create your account
            </Animated.Text>
            <Text style={styles.heroSub}>
              Keep your pets' health, tasks, and records in one place.
            </Text>
          </LinearGradient>

          {/* Card */}
          <Animated.View
            entering={FadeInDown.delay(80).springify()}
            style={styles.card}
          >
            {/* Name */}
            <Label text="Full Name" />
            <TextInput
              placeholder="e.g., Sarah Johnson"
              placeholderTextColor="#9CA3AF"
              value={name}
              onChangeText={setName}
              style={styles.input}
              // style={[styles.input, !!errors.name && styles.inputError]}
              autoCapitalize="words"
              returnKeyType="next"
            />
            {!!errors.name && <Error text={errors.name} />}

            {/* Email */}
            <Label text="Email" top={14} />
            <TextInput
              placeholder="you@example.com"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
              style={[styles.input, !!errors.email && styles.inputError]}
              returnKeyType="next"
            />
            {!!errors.email && <Error text={errors.email} />}

            {/* Password */}
            <Label text="Password" top={14} />
            <View
              style={[
                styles.input,
                styles.inputRow,
                !!errors.password && styles.inputError,
              ]}
            >
              <TextInput
                style={{ flex: 1 }}
                placeholder="•••••••"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showPwd}
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <Pressable onPress={() => setShowPwd((s) => !s)}>
                <Ionicons
                  name={showPwd ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#6B7280"
                />
              </Pressable>
            </View>
            {!!errors.password && <Error text={errors.password} />}

            {/* Terms */}
            <Pressable
              onPress={() => setAgree((v) => !v)}
              style={({ pressed }) => [
                styles.termsRow,
                pressed && { opacity: 0.85 },
              ]}
            >
              <View
                style={[
                  styles.checkbox,
                  agree && {
                    backgroundColor: PALETTE.purpleA,
                    borderColor: PALETTE.purpleA,
                  },
                ]}
              >
                {agree && <Ionicons name="checkmark" size={14} color="#fff" />}
              </View>
              <Text style={styles.termsText}>
                I agree to the <Text style={styles.link}>Terms</Text> and{" "}
                <Text style={styles.link}>Privacy Policy</Text>.
              </Text>
            </Pressable>
            {!!errors.agree && <Error text={errors.agree} />}

            {/* Create account CTA */}
            <Pressable
              disabled={!valid || loading}
              onPress={handleCreate}
              style={({ pressed }) => [
                styles.cta,
                (!valid || loading) && { opacity: 0.6 },
                pressed &&
                  valid && { opacity: 0.9, transform: [{ scale: 0.99 }] },
              ]}
            >
              <LinearGradient
                colors={[PALETTE.purpleA, PALETTE.purpleB]}
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
            <View style={styles.dividerRow}>
              <View style={styles.divider} />
              <Text style={{ color: PALETTE.sub, fontWeight: "700" }}>or</Text>
              <View style={styles.divider} />
            </View>

            {/* Apple / Google buttons */}
            {/* {AppleAuthentication.isAvailableAsync && (
              <AppleRow onPress={signInWithApple} />
            )} */}

            <Pressable
              disabled={!request}
              onPress={() => promptAsync()}
              style={({ pressed }) => [
                styles.oauthBtn,
                pressed && { opacity: 0.9 },
              ]}
            >
              <Ionicons name="logo-google" size={18} color="#111827" />
              <Text style={styles.oauthText}>Continue with Google</Text>
            </Pressable>

            {/* Sign in link (optional) */}
            <View style={{ alignItems: "center", marginTop: 14 }}>
              <Text style={{ color: PALETTE.sub }}>
                Already have an account?{" "}
                <Text style={styles.link}>Sign in</Text>
              </Text>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ----------------------------- UI Bits ----------------------------- */

function Label({ text, top = 6 }: { text: string; top?: number }) {
  return <Text style={[styles.label, { marginTop: top }]}>{text}</Text>;
}

function Error({ text }: { text?: string }) {
  if (!text) return null;
  return <Text style={styles.errorTxt}>{text}</Text>;
}

function randId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function AppleRow({ onPress }: { onPress: () => void }) {
  return (
    <View style={{ marginBottom: 10 }}>
      <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
        cornerRadius={12}
        style={{ width: "100%", height: 48 }}
        onPress={onPress}
      />
    </View>
  );
}

/* ------------------------------- Styles ---------------------------- */

const styles = StyleSheet.create({
  logoCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },

  heroSub: {
    marginTop: 6,
    color: PALETTE.sub,
    fontWeight: "600",
  },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: -14,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: PALETTE.line,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },

  label: {
    color: PALETTE.text,
    fontWeight: "800",
    marginBottom: 6,
  },
  input: {
    height: 50,
    borderWidth: 1.5,
    borderColor: PALETTE.line,
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: "#FFF",
    color: PALETTE.text,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  inputError: {
    borderColor: "#FECACA",
  },
  errorTxt: {
    color: PALETTE.danger,
    fontWeight: "700",
    marginTop: 6,
  },

  termsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: PALETTE.line,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  termsText: { color: PALETTE.sub, flex: 1, flexWrap: "wrap" },
  link: { color: PALETTE.purpleA, fontWeight: "800" },

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

  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 10,
    gap: 10,
  },
  divider: { flex: 1, height: 1, backgroundColor: PALETTE.line },

  oauthBtn: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: PALETTE.line,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
  oauthText: { fontWeight: "800", color: "#111827" },
});
