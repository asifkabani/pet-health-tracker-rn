import React from "react";
import { TextInput, View, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type PasswordFieldProps = {
  value: string;
  onChangeText: (t: string) => void;
  secure: boolean;
  onToggleSecure: () => void;
  containerStyle?: any;
  inputStyle?: any;
};

export const PasswordField = ({
  value,
  onChangeText,
  secure,
  onToggleSecure,
  containerStyle,
  inputStyle,
}: PasswordFieldProps) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <TextInput
        style={[styles.input, inputStyle]}
        placeholder="•••••••"
        placeholderTextColor="#9CA3AF"
        secureTextEntry={secure}
        value={value}
        onChangeText={onChangeText}
        autoCapitalize="none"
        autoCorrect={false}
      />
      <Pressable onPress={onToggleSecure}>
        <Ionicons
          name={secure ? "eye-off-outline" : "eye-outline"}
          size={20}
          color="#6B7280"
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 50,
    borderWidth: 1.5,
    borderColor: "#EEF2FF",
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: "#FFF",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  input: { flex: 1, color: "#0F172A" },
});
