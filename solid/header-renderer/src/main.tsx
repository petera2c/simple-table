import { render } from "solid-js/web";
import Demo from "./demos/header-renderer/HeaderRendererDemo";

render(
  () => <Demo height="500px" />,
  document.getElementById("root")!,
);