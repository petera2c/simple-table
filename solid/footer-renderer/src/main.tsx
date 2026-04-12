import { render } from "solid-js/web";
import Demo from "./demos/footer-renderer/FooterRendererDemo";

render(
  () => <Demo height="500px" />,
  document.getElementById("root")!,
);