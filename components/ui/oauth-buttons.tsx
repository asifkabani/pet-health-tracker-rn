import React from "react";
import { Pressable, Text, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type OAuthButtonsProps = {
  onGooglePress: () => void;
  googleDisabled?: boolean;
  appleButton?: React.ReactNode;
  buttonStyle?: any;
  textStyle?: any;
};

export const OAuthButtons = ({
  onGooglePress,
  googleDisabled,
  appleButton,
  buttonStyle,
  textStyle,
}: OAuthButtonsProps) => {
  return (
    <View>
      {appleButton}
      <Pressable
        disabled={googleDisabled}
        onPress={onGooglePress}
        style={({ pressed }) => [
          styles.googleBtn,
          pressed && { opacity: 0.9 },
        ]}
      >
        <Ionicons name="logo-google" size={18} color="#111827" />
        <Text style={styles.googleText}>Continue with Google</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  googleBtn: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#EEF2FF",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
  googleText: { fontWeight: "800", color: "#111827" },
});
