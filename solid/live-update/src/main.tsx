import { render } from "solid-js/web";
import Demo from "./demos/live-update/LiveUpdateDemo";

render(
  () => <Demo />,
  document.getElementById("root")!,
);