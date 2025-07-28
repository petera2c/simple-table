import { Accessor } from "./HeaderObject";
import HeaderObject from "./HeaderObject";

type HeaderRendererProps<T> = {
  accessor?: Accessor<T>;
  colIndex: number;
  header: HeaderObject<T>;
};

export default HeaderRendererProps;
