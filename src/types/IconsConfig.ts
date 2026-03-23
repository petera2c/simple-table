/** Single icon value used across header, footer, and column editor props */
export type IconElement = SVGSVGElement | HTMLElement | string;

export interface VanillaIconsConfig {
  drag?: IconElement;
  expand?: IconElement;
  filter?: IconElement;
  headerCollapse?: IconElement;
  headerExpand?: IconElement;
  next?: IconElement;
  prev?: IconElement;
  sortDown?: IconElement;
  sortUp?: IconElement;
  /** Label for pin-to-left control in column editor (default: "L") */
  pinnedLeftIcon?: IconElement;
  /** Label for pin-to-right control in column editor (default: "R") */
  pinnedRightIcon?: IconElement;
}

export interface IconsConfig extends VanillaIconsConfig {}
