import { render } from "solid-js/web";
import Demo from "./demos/sales/SalesDemo";

render(
  () => <Demo height="500px" />,
  document.getElementById("root")!,
);