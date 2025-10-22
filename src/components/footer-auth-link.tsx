import React from "react";
import { Text, View, Pressable } from "react-native";

type FooterAuthLinkProps = {
  text: string;
  linkText: string;
  onPress: () => void;
  containerStyle?: any;
  textStyle?: any;
  linkStyle?: any;
};

export const FooterAuthLink = ({
  text,
  linkText,
  onPress,
  containerStyle,
  textStyle,
  linkStyle,
}: FooterAuthLinkProps) => {
  return (
    <View style={containerStyle}>
      <Text style={textStyle}>
        {text + " "}
        <Pressable onPress={onPress}>
          <Text style={linkStyle}>{linkText}</Text>
        </Pressable>
      </Text>
    </View>
  );
};

