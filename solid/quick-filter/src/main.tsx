import { render } from "solid-js/web";
import Demo from "./demos/quick-filter/QuickFilterDemo";

render(
  () => <Demo height="500px" />,
  document.getElementById("root")!,
);