import { render } from "solid-js/web";
import Demo from "./demos/single-row-children/SingleRowChildrenDemo";

render(
  () => <Demo height="500px" />,
  document.getElementById("root")!,
);