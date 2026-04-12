import { render } from "solid-js/web";
import Demo from "./demos/aggregate-functions/AggregateFunctionsDemo";

render(
  () => <Demo height="500px" />,
  document.getElementById("root")!,
);