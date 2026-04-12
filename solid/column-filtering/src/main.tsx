import { render } from "solid-js/web";
import Demo from "./demos/column-filtering/ColumnFilteringDemo";

render(
  () => <Demo height="500px" />,
  document.getElementById("root")!,
);