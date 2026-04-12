import { render } from "solid-js/web";
import Demo from "./demos/cell-editing/CellEditingDemo";

render(
  () => <Demo height="500px" />,
  document.getElementById("root")!,
);