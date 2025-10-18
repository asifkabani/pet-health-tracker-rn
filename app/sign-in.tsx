import {
  AppleAuthButton,
  ErrorText,
  FooterAuthLink,
  FormLabel,
  HeaderHero,
  OAuthButtons,
  PasswordField,
  PrimaryButton,
  TermsCheckbox,
  TextField,
} from "@/components/ui";
import { SIGN_IN_PALETTE } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import React, { JSX } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthFlows } from "./hooks/useAuthFlows";
import { useSignUpForm } from "./hooks/useSignUpForm";

WebBrowser.maybeCompleteAuthSession();

export default function SignUpScreen(): JSX.Element {
  const {
    name,
    email,
    password,
    showPwd,
    agree,
    loading,
    setName,
    setEmail,
    setPassword,
    setLoading,
    toggleShowPwd,
    toggleAgree,
    errors,
    valid,
  } = useSignUpForm();

  const {
    checking,
    appleAvailable,
    request,
    promptAsync,
    signInWithApple,
    createLocalAccount,
  } = useAuthFlows();

  const handleCreate = async () => {
    if (!valid) {
      return;
    }
    try {
      setLoading(true);
      await createLocalAccount(name, email);
    } catch (err) {
      console.error(err);
      Alert.alert("Save failed", "Please try again.");
    } finally {
      setLoading(false);
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
          <HeaderHero
            title="Create your account"
            subtitle="Keep your pets' health, tasks, and records in one place."
            // HeaderHero now owns its own styles by default
          />

          {/* Card */}
          <Animated.View
            entering={FadeInDown.delay(80).springify()}
            style={styles.card}
          >
            {/* Name */}
            <TextField
              label="Full Name"
              value={name}
              onChangeText={setName}
              placeholder="e.g., Sarah Johnson"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="words"
              returnKeyType="next"
              // TextField has standardized label/input styles
              error={errors.name}
            />

            {/* Email */}
            <View style={{ marginTop: 14 }}>
              <TextField
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                returnKeyType="next"
                inputStyle={
                  !!errors.email ? { borderColor: "#FECACA" } : undefined
                }
                error={errors.email}
              />
            </View>

            {/* Password */}
            <View style={{ marginTop: 14 }}>
              <FormLabel>Password</FormLabel>
              <PasswordField
                value={password}
                onChangeText={setPassword}
                secure={!showPwd}
                onToggleSecure={toggleShowPwd}
                containerStyle={
                  !!errors.password ? { borderColor: "#FECACA" } : undefined
                }
              />
              <ErrorText text={errors.password} />
            </View>

            {/* Terms */}
            <TermsCheckbox
              checked={agree}
              onToggle={toggleAgree}
              containerStyle={({ pressed }: any) => [
                pressed && { opacity: 0.85 },
              ]}
              checkedStyles={{
                backgroundColor: SIGN_IN_PALETTE.purpleA,
                borderColor: SIGN_IN_PALETTE.purpleA,
              }}
              // TermsCheckbox has standardized checkbox/text/link styles
              renderCheckIcon={() => (
                <Ionicons name="checkmark" size={14} color="#fff" />
              )}
            />
            <ErrorText text={errors.agree} />

            {/* Create account CTA */}
            <PrimaryButton
              title="Create Account"
              onPress={handleCreate}
              loading={loading}
              disabled={!valid || loading}
            />

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.divider} />
              <Text style={{ color: SIGN_IN_PALETTE.sub, fontWeight: "700" }}>
                or
              </Text>
              <View style={styles.divider} />
            </View>

            {/* Apple / Google buttons */}
            <OAuthButtons
              appleButton={
                appleAvailable ? (
                  <AppleAuthButton
                    onPress={signInWithApple}
                    containerStyle={{ marginBottom: 10 }}
                  />
                ) : undefined
              }
              googleDisabled={!request}
              onGooglePress={() => promptAsync()}
            />

            {/* Sign in link (optional) */}
            <FooterAuthLink
              text="Already have an account?"
              linkText="Sign in"
              onPress={() => {}}
              containerStyle={{ alignItems: "center", marginTop: 14 }}
              textStyle={{ color: SIGN_IN_PALETTE.sub }}
              linkStyle={styles.link}
            />
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ------------------------------- Styles ---------------------------- */
const styles = {
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: -14,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#EEF2FF",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 10,
    gap: 10,
  },
  divider: { flex: 1, height: 1, backgroundColor: "#EEF2FF" },
  link: { color: "#7C3AED", fontWeight: "800" },
} as const;
