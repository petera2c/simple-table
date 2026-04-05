import { render } from "solid-js/web";
import Demo from "./demos/infrastructure/InfrastructureDemo";

render(
  () => (
    <div style={{ padding: "24px" }}>
      <Demo height="500px" />
    </div>
  ),
  document.getElementById("root")!,
);