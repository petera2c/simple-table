import { render } from "solid-js/web";
import Demo from "./demos/programmatic-control/ProgrammaticControlDemo";

render(
  () => <Demo height="500px" />,
  document.getElementById("root")!,
);