import { render } from "solid-js/web";
import Demo from "./demos/value-formatter/ValueFormatterDemo";

render(
  () => <Demo height="500px" />,
  document.getElementById("root")!,
);