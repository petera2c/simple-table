import { render } from "solid-js/web";
import Demo from "./demos/column-alignment/ColumnAlignmentDemo";

render(
  () => <Demo height="500px" />,
  document.getElementById("root")!,
);