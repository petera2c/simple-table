import HeaderObject from "./HeaderObject";
import type { PanelSection } from "./PanelSection";

export type FlattenedHeader = {
  header: HeaderObject;
  visualIndex: number;
  depth: number;
  parent: HeaderObject | null;
  indexPath: number[];
  panelSection?: PanelSection;
};
