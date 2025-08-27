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
  ];

  return (
    <Tabs
      screenOptions={{
        animation: "shift",
        headerShown: false,
        tabBarActiveTintColor: "#ffd33d",
        tabBarStyle: {
          backgroundColor: "#25292e",
        },
      }}
    >
      {tabScreens.map((tab, index) => {
        const iconName = (focused: boolean): string =>
          focused ? tab.icon.focused : tab.icon.default;

        return (
          <Tabs.Screen
            key={`${tab.name}-${index}`}
            name={tab.name}
            options={{
              title: `${tab.title}`,
              tabBarIcon: ({ color, focused }) => (
                <Ionicons name={iconName(focused)} color={color} size={24} />
              ),
            }}
          />
        );
      })}
    </Tabs>
  );
}
