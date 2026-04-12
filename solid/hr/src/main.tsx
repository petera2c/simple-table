import { render } from "solid-js/web";
import Demo from "./demos/hr/HRDemo";

render(
  () => <Demo height="500px" />,
  document.getElementById("root")!,
);