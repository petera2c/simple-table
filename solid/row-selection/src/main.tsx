import { render } from "solid-js/web";
import Demo from "./demos/row-selection/RowSelectionDemo";

render(
  () => <Demo height="500px" />,
  document.getElementById("root")!,
);