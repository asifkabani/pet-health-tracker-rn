import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { memo, useMemo, useState } from "react";
import { View } from "react-native";

const SegmentedTabs = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const tabs = useMemo(() => ["Today", "Upcoming", "Overdue"], []);

  return (
    <View className="p-3">
      <SegmentedControl
        values={tabs}
        selectedIndex={selectedIndex}
        onChange={(e: any) => {
          setSelectedIndex(e.nativeEvent.selectedSegmentIndex);
        }}
        tintColor="#6b4de6"
        backgroundColor="white"
        fontStyle={{ color: "#4b5563", fontSize: 14, fontWeight: "500" }}
        activeFontStyle={{ color: "white", fontSize: 14, fontWeight: "500" }}
        style={{ height: 40 }}
      />
    </View>
  );
};

export const SegmentedTabsControl = memo(SegmentedTabs);
