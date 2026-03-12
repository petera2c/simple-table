import type { Accessor } from "./HeaderObject";
import type HeaderObject from "./HeaderObject";
import type { IconElement } from "./IconsConfig";

export interface ColumnEditorRowRendererComponents {
  expandIcon?: IconElement;
  checkbox?: HTMLElement | string;
  dragIcon?: IconElement;
  labelContent?: string | HTMLElement;
}

interface ColumnEditorRowRendererProps {
  accessor: Accessor;
  header: HeaderObject;
  components: ColumnEditorRowRendererComponents;
}

export type ColumnEditorRowRenderer = (props: ColumnEditorRowRendererProps) => HTMLElement | string | null;

export default ColumnEditorRowRendererProps;
