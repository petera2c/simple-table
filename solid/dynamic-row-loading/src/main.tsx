import { render } from "solid-js/web";
import Demo from "./demos/dynamic-row-loading/DynamicRowLoadingDemo";

render(
  () => <Demo height="500px" />,
  document.getElementById("root")!,
);