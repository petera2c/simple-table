import type { Accessor } from "./HeaderObject";
import type HeaderObject from "./HeaderObject";

export interface ColumnEditorRowRendererComponents {
  expandIcon?: any;
  checkbox?: any;
  dragIcon?: any;
  labelContent?: any;
}

interface ColumnEditorRowRendererProps {
  accessor: Accessor;
  header: HeaderObject;
  components: ColumnEditorRowRendererComponents;
}

export type ColumnEditorRowRenderer = (props: ColumnEditorRowRendererProps) => any;

export default ColumnEditorRowRendererProps;
