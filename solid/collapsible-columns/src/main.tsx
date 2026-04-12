import { render } from "solid-js/web";
import Demo from "./demos/collapsible-columns/CollapsibleColumnsDemo";

render(
  () => <Demo height="500px" />,
  document.getElementById("root")!,
);