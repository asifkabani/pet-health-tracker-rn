import React from "react";
import { Text, TextInput, TextInputProps, View } from "react-native";

type Props = TextInputProps & {
  label: string;
  error?: string;
  containerClassName?: string;
};

export default function TextField({
  label,
  error,
  containerClassName = "",
  ...rest
}: Props) {
  return (
    <View className={containerClassName}>
      <Text className="text-slate-900 font-extrabold mb-2">{label}</Text>
      <TextInput
        className={`h-12 px-3 rounded-xl border bg-white text-slate-900 ${
          error ? "border-rose-300" : "border-indigo-50"
        }`}
        placeholderTextColor="#9CA3AF"
        {...rest}
      />
      {!!error && <Text className="text-rose-500 font-bold mt-2">{error}</Text>}
    </View>
  );
}
