import { render } from "solid-js/web";
import Demo from "./demos/column-visibility/ColumnVisibilityDemo";

render(
  () => <Demo height="500px" />,
  document.getElementById("root")!,
);