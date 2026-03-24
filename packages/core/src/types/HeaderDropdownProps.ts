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

export type VanillaHeaderDropdown = (props: HeaderDropdownProps) => HTMLElement | string | null;

export type HeaderDropdown = (props: HeaderDropdownProps) => HTMLElement | string | null;

export default HeaderDropdownProps;
