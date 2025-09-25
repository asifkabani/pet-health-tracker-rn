import { useAuthStore } from "@/store/auth";
import { usePetsStore } from "@/store/pets";
import { toTitleCase } from "@/util/helpers";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { memo } from "react";
import { Text, View } from "react-native";
import Animated from "react-native-reanimated";

const TIME_OF_DAY = "morning";

const HeaderComponent = () => {
  const { user } = useAuthStore();
  const { pets } = usePetsStore();
  const { name, avatarUrl } = user || {};

  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  return (
    <Animated.View className="px-5 pt-4 pb-2">
      <Text className="text-sm text-gray-500 font-medium">{today}</Text>
      <View className="flex-row items-center mt-2">
        <View className="flex-1">
          <Text className="text-xl font-bold text-gray-800">
            {`Good ${toTitleCase(TIME_OF_DAY)}, ${toTitleCase(name!)}!`}
          </Text>
          <Text className="text-sm text-purple-600 font-medium">
            {`${pets[0].name} is counting on you 🐾`}
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
          source={{
            uri:
              user?.avatarUrl ??
              "https://ui-avatars.com/api/?background=ECEAFF&color=4422AA&name=" +
                encodeURIComponent(user?.name ?? "User"),
          }}
        />
      </View>
    </Animated.View>
  );
};

export const Header = memo(HeaderComponent);
