import { ReactNode } from "react";
import HeaderRendererProps from "./HeaderRendererProps";

interface HeaderDropdownProps extends HeaderRendererProps {
  isOpen: boolean;
  onClose: () => void;
  position: {
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
  };
}

export type HeaderDropdown = (props: HeaderDropdownProps) => ReactNode;

export default HeaderDropdownProps;
