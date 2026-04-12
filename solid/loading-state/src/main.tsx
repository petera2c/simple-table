import { render } from "solid-js/web";
import Demo from "./demos/loading-state/LoadingStateDemo";

render(
  () => <Demo height="500px" />,
  document.getElementById("root")!,
);