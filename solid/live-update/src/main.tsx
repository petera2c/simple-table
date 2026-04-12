import { render } from "solid-js/web";
import Demo from "./demos/live-update/LiveUpdateDemo";

render(
  () => <Demo height="500px" />,
  document.getElementById("root")!,
);