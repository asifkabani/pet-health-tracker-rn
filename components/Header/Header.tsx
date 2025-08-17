import { PADDING_H } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

const HeaderComponent = () => {
  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  return (
    <Animated.View
      entering={FadeInDown.delay(50).springify()}
      style={styles.header}
    >
      <Text className="text-sm text-gray-500 font-medium">{today}</Text>
      <View style={styles.rowBetween}>
        <View style={{ flex: 1, paddingRight: 16 }}>
          <Text className="text-xl font-bold text-gray-800">
            Good morning, Sarah!
          </Text>
          <Text className="text-sm text-purple-600 font-medium">
            Bella & Max are counting on you 🐾
          </Text>
        </View>
        <View className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
          <Ionicons.Button
            name="notifications-outline"
            backgroundColor="#f3e8ff"
            borderRadius={50}
            size={22}
            color="#9333ea"
            iconStyle={{ margin: 0 }}
            onPress={(e) => console.log(e)}
          />
        </View>
        <Image
          className="w-10 h-10 rounded-full border-2 border-purple-200"
          contentFit="cover"
          source="https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=200&auto=format&fit=crop"
        />
      </View>
    </Animated.View>
  );
};

export const Header = memo(HeaderComponent);

const styles = StyleSheet.create({
  header: { paddingHorizontal: PADDING_H, paddingTop: 16, paddingBottom: 10 },
  rowBetween: { flexDirection: "row", alignItems: "center", marginTop: 10 },
});
