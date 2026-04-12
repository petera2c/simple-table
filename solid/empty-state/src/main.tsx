import { render } from "solid-js/web";
import Demo from "./demos/empty-state/EmptyStateDemo";

render(
  () => <Demo height="500px" />,
  document.getElementById("root")!,
);