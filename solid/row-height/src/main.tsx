import { render } from "solid-js/web";
import Demo from "./demos/row-height/RowHeightDemo";

render(
  () => (
    <div style={{ padding: "24px" }}>
      <Demo height="500px" />
    </div>
  ),
  document.getElementById("root")!,
);