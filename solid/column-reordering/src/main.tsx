import { render } from "solid-js/web";
import Demo from "./demos/column-reordering/ColumnReorderingDemo";

render(
  () => <Demo height="500px" />,
  document.getElementById("root")!,
);