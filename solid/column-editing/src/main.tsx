import { render } from "solid-js/web";
import Demo from "./demos/column-editing/ColumnEditingDemo";

render(
  () => <Demo height="500px" />,
  document.getElementById("root")!,
);