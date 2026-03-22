import { ReactNode } from "react";
import type { Accessor } from "./HeaderObject";
import type HeaderObject from "./HeaderObject";
import type { PanelSection } from "../utils/pinnedColumnUtils";

export interface ColumnEditorRowRendererComponents {
  expandIcon?: ReactNode;
  checkbox?: ReactNode;
  dragIcon?: ReactNode;
  labelContent?: ReactNode;
  /** Default pin column (outline / filled); omit when building a fully custom row */
  pinIcon?: ReactNode;
}

/** Pin / unpin actions for column editor rows (also use for lock/tooltip UX via isEssential). */
export interface ColumnEditorPinControl {
  pinnedSide: "left" | "right" | null;
  canPinLeft: boolean;
  canPinRight: boolean;
  canUnpin: boolean;
  pinLeft: () => void;
  pinRight: () => void;
  unpin: () => void;
}

interface ColumnEditorRowRendererProps {
  accessor: Accessor;
  header: HeaderObject;
  components: ColumnEditorRowRendererComponents;
  /** Which panel section this row is rendered in */
  panelSection?: PanelSection;
  /** Resolved from essentialColumns, HeaderObject.isEssential */
  isEssential?: boolean;
  /** False when visibility cannot be toggled (essential columns) */
  canToggleVisibility?: boolean;
  /** Mirrors `columnEditorConfig.allowColumnPinning` (default true) */
  allowColumnPinning?: boolean;
  pinControl?: ColumnEditorPinControl;
}

export type ColumnEditorRowRenderer = (props: ColumnEditorRowRendererProps) => ReactNode | string;

export default ColumnEditorRowRendererProps;
export type { PanelSection };
