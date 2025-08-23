import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  const tabScreens = [
    { name: "index", title: "Home", icon: "home" },
    { name: "pets", title: "Pets", icon: "paw" },
    { name: "settings", title: "Settings", icon: "cog" },
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
          focused ? `${tab.icon}-sharp` : `${tab.icon}-outline`;

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
