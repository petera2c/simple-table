import { render } from "solid-js/web";
import Demo from "./demos/cell-renderer/CellRendererDemo";

render(
  () => <Demo />,
  document.getElementById("root")!,
);