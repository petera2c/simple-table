import { render } from "solid-js/web";
import Demo from "./demos/nested-tables/NestedTablesDemo";

render(
  () => <Demo height="500px" />,
  document.getElementById("root")!,
);