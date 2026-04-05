import { render } from "solid-js/web";
import Demo from "./demos/single-row-children/SingleRowChildrenDemo";

render(
  () => (
    <div style={{ padding: "24px" }}>
      <Demo height="500px" />
    </div>
  ),
  document.getElementById("root")!,
);