import { render } from "solid-js/web";
import Demo from "./demos/cell-clicking/CellClickingDemo";

render(
  () => <Demo height="500px" />,
  document.getElementById("root")!,
);