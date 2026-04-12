import { render } from "solid-js/web";
import Demo from "./demos/manufacturing/ManufacturingDemo";

render(
  () => <Demo height="500px" />,
  document.getElementById("root")!,
);