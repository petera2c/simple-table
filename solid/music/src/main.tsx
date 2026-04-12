import { render } from "solid-js/web";
import Demo from "./demos/music/MusicDemo";

render(
  () => <Demo height="500px" />,
  document.getElementById("root")!,
);