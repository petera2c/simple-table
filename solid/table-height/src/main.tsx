import { render } from "solid-js/web";
import Demo from "./demos/table-height/TableHeightDemo";

render(
  () => <Demo height="500px" />,
  document.getElementById("root")!,
);