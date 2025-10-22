import React from "react";
import { StyleProp, Text, TextStyle } from "react-native";

type FormLabelProps = {
  children: React.ReactNode;
  top?: number;
  style?: StyleProp<TextStyle>;
};

export const FormLabel = ({ children, top = 6, style }: FormLabelProps) => {
  return <Text style={[{ marginTop: top }, style]}>{children}</Text>;
};
