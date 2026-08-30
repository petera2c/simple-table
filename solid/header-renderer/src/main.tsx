import { render } from "solid-js/web";
import Demo from "./demos/header-renderer/HeaderRendererDemo";

render(
  () => <Demo />,
  document.getElementById("root")!,
);