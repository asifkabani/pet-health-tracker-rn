export interface SegmentedTabsProps {
  tabValues: string[];
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
}
