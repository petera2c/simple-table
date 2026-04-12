import { render } from "solid-js/web";
import Demo from "./demos/custom-theme/CustomThemeDemo";

render(
  () => <Demo height="500px" />,
  document.getElementById("root")!,
);