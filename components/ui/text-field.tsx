import React from "react";
import { TextInput, View, Text, TextInputProps, StyleSheet } from "react-native";

type TextFieldProps = {
  label: string;
  error?: string;
  containerStyle?: any;
  labelStyle?: any;
  inputStyle?: any;
} & TextInputProps;

export const TextField = ({
  label,
  error,
  containerStyle,
  labelStyle,
  inputStyle,
  ...inputProps
}: TextFieldProps) => {
  return (
    <View style={containerStyle}>
      <Text style={[styles.label, labelStyle]}>{label}</Text>
      <TextInput style={[styles.input, inputStyle]} {...inputProps} />
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  label: { color: "#0F172A", fontWeight: "800", marginBottom: 6 },
  input: {
    height: 50,
    borderWidth: 1.5,
    borderColor: "#EEF2FF",
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: "#FFF",
    color: "#0F172A",
  },
  error: { color: "#EF4444", fontWeight: "700", marginTop: 6 },
});
