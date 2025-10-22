import { SIGN_IN_PALETTE } from "@/constants";
import React from "react";
import { StyleProp, StyleSheet, Text, TextStyle } from "react-native";

type ErrorTextProps = {
  text?: string;
  style?: StyleProp<TextStyle>;
};

export const ErrorText = ({ text }: ErrorTextProps) => {
  if (!text) {
    return null;
  }

  return <Text style={styles.errorTxt}>{text}</Text>;
};

const styles = StyleSheet.create({
  errorTxt: {
    color: SIGN_IN_PALETTE.danger,
    fontWeight: "700",
    marginTop: 6,
  },
});
