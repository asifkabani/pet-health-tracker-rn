import "@/global.css";
import { Slot, useRootNavigationState } from "expo-router";
import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export default function RootLayout() {
  const navReady = !!useRootNavigationState()?.key;

  return (
    <View style={{ flex: 1 }}>
      <Slot />
      {!navReady && (
        <View style={[StyleSheet.absoluteFill, styles.loader]}>
          <ActivityIndicator />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loader: {
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
});
