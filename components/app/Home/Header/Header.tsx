import { Pet } from "@/store";
import { toTitleCase } from "@/util";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { memo } from "react";
import { Text, View } from "react-native";
import Animated from "react-native-reanimated";

type HeaderProps = {
  date: string;
  timeOfDay: string;
  userName: string;
  pets: Pet[];
};

const HeaderComponent = ({ date, timeOfDay, userName, pets }: HeaderProps) => {
  return (
    <Animated.View className="px-5 pt-4 pb-2">
      <Text className="text-sm text-gray-500 font-medium">{date}</Text>
      <View className="flex-row items-center mt-2">
        <View className="flex-1">
          <Text className="text-xl font-bold text-gray-800">
            {`Good ${toTitleCase(timeOfDay)}, ${toTitleCase(userName)}!`}
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
          source="https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=200&auto=format&fit=crop"
        />
      </View>
    </Animated.View>
  );
};

export const Header = memo(HeaderComponent);
