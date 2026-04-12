import { render } from "solid-js/web";
import Demo from "./demos/infrastructure/InfrastructureDemo";

render(
  () => <Demo height="500px" />,
  document.getElementById("root")!,
);