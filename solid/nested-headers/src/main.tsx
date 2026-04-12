import { render } from "solid-js/web";
import Demo from "./demos/nested-headers/NestedHeadersDemo";

render(
  () => <Demo height="500px" />,
  document.getElementById("root")!,
);