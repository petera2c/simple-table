import { render } from "solid-js/web";
import Demo from "./demos/external-sort/ExternalSortDemo";

render(
  () => <Demo height="500px" />,
  document.getElementById("root")!,
);