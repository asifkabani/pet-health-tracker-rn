import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  const tabScreens = [
    {
      name: "index",
      title: "Home",
      icon: { default: "home-outline", focused: "home-sharp" },
    },
    {
      name: "pets",
      title: "Pets",
      icon: { default: "paw-outline", focused: "paw-sharp" },
    },
    {
      name: "settings",
      title: "Settings",
      icon: { default: "cog-outline", focused: "cog-sharp" },
    },
  ] as const;

  return (
    <Tabs
      // tabBar={(props) => <AppTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true, // better for forms
        // (We style via our custom tabBar; keep these minimal)
      }}
    >
      {tabScreens.map((tab) => {
        const iconName = (focused: boolean): keyof typeof Ionicons.glyphMap =>
          (focused
            ? tab.icon.focused
            : tab.icon.default) as keyof typeof Ionicons.glyphMap;

        return (
          <Tabs.Screen
            key={tab.name}
            name={tab.name}
            options={{
              title: tab.title,
              tabBarIcon: ({ color, focused, size }) => (
                <Ionicons
                  name={iconName(focused)}
                  color={color}
                  size={size ?? 22}
                />
              ),
            }}
          />
        );
      })}
    </Tabs>
  );
}
