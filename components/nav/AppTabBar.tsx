import { useBadgeStore } from "@/store/badges";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { cssInterop } from "nativewind";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const LG = cssInterop(LinearGradient, { className: "style" });

export default function AppTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const badges = useBadgeStore((s) => s.badges);

  return (
    <View
      className="bg-transparent"
      style={{ paddingBottom: Math.max(insets.bottom - 4, 6) }}
    >
      <View className="mx-4 mb-2 rounded-3xl border border-indigo-50 bg-white shadow-lg">
        <View className="flex-row h-16 items-stretch">
          {state.routes.map((route, index) => {
            const focused = state.index === index;
            const { options } = descriptors[route.key];

            const onPress = () => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });
              if (!focused && !event.defaultPrevented) {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                navigation.navigate(route.name);
              }
            };

            const label = options.title ?? route.name;
            const color = focused ? "#7C3AED" : "#6B7280";
            const size = 22;

            const rawCount = badges[route.name] ?? 0;
            const showBadge = rawCount > 0;
            const badgeText = rawCount > 99 ? "99+" : String(rawCount);

            return (
              <Pressable
                key={route.key}
                onPress={onPress}
                className="flex-1 items-center justify-center relative"
              >
                {/* Focus glow behind icon */}
                {focused && (
                  <LG
                    colors={["#7C3AED", "#6D28D9"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    className="absolute top-2 h-9 w-16 rounded-full opacity-10"
                  />
                )}

                {/* Icon + label */}
                <View className="items-center justify-center">
                  {options.tabBarIcon
                    ? options.tabBarIcon({ focused, color, size })
                    : null}
                  <Text
                    className={`mt-1 text-[11px] font-extrabold ${
                      focused ? "text-indigo-600" : "text-slate-500"
                    }`}
                    numberOfLines={1}
                  >
                    {label}
                  </Text>
                </View>

                {/* Badge */}
                {showBadge && (
                  <View className="absolute top-1 right-6 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 items-center justify-center">
                    <Text className="text-white text-[10px] font-extrabold">
                      {badgeText}
                    </Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}
