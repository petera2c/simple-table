import { render } from "solid-js/web";
import Demo from "./demos/cell-highlighting/CellHighlightingDemo";

render(
  () => <Demo height="500px" />,
  document.getElementById("root")!,
);