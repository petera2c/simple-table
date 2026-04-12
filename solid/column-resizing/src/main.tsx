import { render } from "solid-js/web";
import Demo from "./demos/column-resizing/ColumnResizingDemo";

render(
  () => <Demo height="500px" />,
  document.getElementById("root")!,
);