import ColumnDef from "./ColumnDef";
import type { PanelSection } from "./PanelSection";

export type FlattenedHeader = {
  header: ColumnDef;
  visualIndex: number;
  depth: number;
  parent: ColumnDef | null;
  indexPath: number[];
  panelSection?: PanelSection;
};
