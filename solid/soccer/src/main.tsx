import { render } from "solid-js/web";
import Demo from "./demos/soccer/SoccerDemo";

render(
  () => <Demo />,
  document.getElementById("root")!,
);