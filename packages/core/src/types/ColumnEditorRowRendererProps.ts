import type { Accessor } from "./HeaderObject";
import type HeaderObject from "./HeaderObject";
import type { IconElement } from "./IconsConfig";
import type { PanelSection } from "./PanelSection";

export interface ColumnEditorRowRendererComponents {
  expandIcon?: IconElement;
  checkbox?: HTMLElement | string;
  dragIcon?: IconElement;
  labelContent?: string | HTMLElement;
  /** Default pin column (outline / filled); omit when building a fully custom row */
  pinIcon?: IconElement;
}

/** Pin / unpin actions for column editor rows (also use for lock/tooltip UX via HeaderObject.isEssential). */
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
  /** Resolved from HeaderObject.isEssential / essentialAccessors */
  isEssential?: boolean;
  /** False when visibility cannot be toggled (essential columns) */
  canToggleVisibility?: boolean;
  /** Mirrors `columnEditorConfig.allowColumnPinning` (default true) */
  allowColumnPinning?: boolean;
  pinControl?: ColumnEditorPinControl;
}

export type ColumnEditorRowRenderer = (props: ColumnEditorRowRendererProps) => HTMLElement | string | null;

export default ColumnEditorRowRendererProps;
export type { PanelSection };
