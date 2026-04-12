import { render } from "solid-js/web";
import Demo from "./demos/quick-start/QuickStartDemo";

render(
  () => <Demo height="500px" />,
  document.getElementById("root")!,
);