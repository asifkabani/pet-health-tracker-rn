import { StyleSheet, Text, View } from "react-native";
import { PrimaryButton } from "@/components/ui";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AUTH_STORAGE_KEY } from "@/constants";
import { useStore } from "@/store";
import { router } from "expo-router";

export default function SettingsScreen() {
  const setAuthenticated = useStore((s) => s.setAuthenticated);

  const handleSignOut = async () => {
    try {
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      setAuthenticated(false);
      router.replace("/sign-in");
    } catch (e) {
      console.error("Sign out failed", e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Settings</Text>
      <View style={{ height: 16 }} />
      <PrimaryButton title="Sign Out" onPress={handleSignOut} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#fff",
  },
});
