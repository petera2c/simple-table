import { render } from "solid-js/web";
import Demo from "./demos/dynamic-nested-tables/DynamicNestedTablesDemo";

render(
  () => <Demo height="500px" />,
  document.getElementById("root")!,
);