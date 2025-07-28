import { Accessor } from "./HeaderObject";
import Theme from "./Theme";

type CellRendererProps<T> = {
  accessor: Accessor<T>;
  colIndex: number;
  row: any;
  theme: Theme;
};

export default CellRendererProps;
