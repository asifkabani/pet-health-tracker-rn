import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import * as AppleAuthentication from "expo-apple-authentication";

type AppleAuthButtonProps = {
  onPress: () => void;
  containerStyle?: StyleProp<ViewStyle>;
};

export const AppleAuthButton = ({
  onPress,
  containerStyle,
}: AppleAuthButtonProps) => {
  return (
    <View style={containerStyle}>
      <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
        cornerRadius={12}
        style={{ width: "100%", height: 48 }}
        onPress={onPress}
      />
    </View>
  );
};
