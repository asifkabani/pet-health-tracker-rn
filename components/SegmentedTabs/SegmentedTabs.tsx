import { SegmentedTabsProps } from "@/types/tabs";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { memo, useCallback } from "react";
import { View } from "react-native";

const SegmentedTabs = ({
  tabsValues,
  selectedIndex,
  setSelectedIndex,
}: SegmentedTabsProps) => {
  const handleTabChange = useCallback(
    (index: number) => setSelectedIndex(index),
    [selectedIndex, setSelectedIndex]
  );

  return (
    <View className="p-3">
      <SegmentedControl
        values={tabsValues}
        selectedIndex={selectedIndex}
        onChange={(e) => handleTabChange(e.nativeEvent.selectedSegmentIndex)}
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
