import { render } from "solid-js/web";
import Demo from "./demos/themes/ThemesDemo";

render(
  () => <Demo height="500px" />,
  document.getElementById("root")!,
);