import { Pressable, Text } from "react-native";
import { ButtonProps } from "./Button.types";

export const Button = ({
  onPress,
  icon,
  text,
  bgColorClass,
  disabled,
}: ButtonProps) => {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={text}
      disabled={disabled}
      onPress={onPress}
      className={`px-4 py-2 rounded-xl shadow-sm ${bgColorClass}`}
    >
      {icon}
      <Text className="text-white text-sm font-medium">{text}</Text>
    </Pressable>
  );
};
