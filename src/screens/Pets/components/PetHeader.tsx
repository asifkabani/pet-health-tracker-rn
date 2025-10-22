import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text } from "react-native";

export const PetHeader = () => {
  const router = useRouter();

  return (
    <LinearGradient
      colors={["#F1E9FF", "#E9F2FF"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.headerGrad}
    >
      <Pressable style={styles.circleBtn} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={20} color="#111827" />
      </Pressable>

      <Pressable
        style={[styles.editBtn, styles.shadow]}
        onPress={() => Haptics.selectionAsync()}
      >
        <Text style={{ fontWeight: "700", color: "#111827" }}>Edit</Text>
      </Pressable>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  headerGrad: {
    height: 180,
    paddingTop: 20,
    paddingHorizontal: 16,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "flex-start",
  },
  circleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  editBtn: {
    paddingHorizontal: 16,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  shadow: {
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
});
