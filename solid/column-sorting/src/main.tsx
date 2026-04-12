import { render } from "solid-js/web";
import Demo from "./demos/column-sorting/ColumnSortingDemo";

render(
  () => <Demo height="500px" />,
  document.getElementById("root")!,
);