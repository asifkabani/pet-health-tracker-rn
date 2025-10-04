import { ReactElement } from "react";

export interface ButtonProps {
  text: string;
  bgColorClass: string;
  disabled?: boolean;
  icon?: ReactElement;
  onPress: () => void;
}
