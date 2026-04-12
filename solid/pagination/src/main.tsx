import { render } from "solid-js/web";
import Demo from "./demos/pagination/PaginationDemo";

render(
  () => <Demo height="500px" />,
  document.getElementById("root")!,
);