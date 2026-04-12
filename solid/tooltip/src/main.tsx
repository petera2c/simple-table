import { render } from "solid-js/web";
import Demo from "./demos/tooltip/TooltipDemo";

render(
  () => <Demo height="500px" />,
  document.getElementById("root")!,
);