import { render } from "solid-js/web";
import Demo from "./demos/charts/ChartsDemo";

render(
  () => <Demo height="500px" />,
  document.getElementById("root")!,
);