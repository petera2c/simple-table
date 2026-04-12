import { render } from "solid-js/web";
import Demo from "./demos/column-width/ColumnWidthDemo";

render(
  () => <Demo height="500px" />,
  document.getElementById("root")!,
);