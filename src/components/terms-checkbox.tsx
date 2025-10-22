import React from "react";
import { Pressable, Text, View, StyleSheet } from "react-native";

type TermsCheckboxProps = {
  checked: boolean;
  onToggle: () => void;
  containerStyle?: any;
  checkboxStyle?: any;
  checkedStyles?: any;
  textStyle?: any;
  linkStyle?: any;
  renderCheckIcon?: () => React.ReactNode;
};

export const TermsCheckbox = ({
  checked,
  onToggle,
  containerStyle,
  checkboxStyle,
  checkedStyles,
  textStyle,
  linkStyle,
  renderCheckIcon,
}: TermsCheckboxProps) => {
  return (
    <Pressable onPress={onToggle} style={[styles.row, containerStyle]}>
      <View style={[styles.checkbox, checkboxStyle, checked && (checkedStyles ?? styles.checked)]}>
        {checked && (renderCheckIcon ? renderCheckIcon() : null)}
      </View>
      <Text style={[styles.text, textStyle]}>
        I agree to the <Text style={[styles.link, linkStyle]}>Terms</Text> and <Text style={[styles.link, linkStyle]}>Privacy Policy</Text>.
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", marginTop: 14 },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: "#EEF2FF",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  checked: { backgroundColor: "#7C3AED", borderColor: "#7C3AED" },
  text: { color: "#6B7280", flex: 1, flexWrap: "wrap" },
  link: { color: "#7C3AED", fontWeight: "800" },
});
