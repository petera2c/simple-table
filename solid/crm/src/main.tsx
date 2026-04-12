import { render } from "solid-js/web";
import Demo from "./demos/crm/CRMDemo";

render(
  () => <Demo height="500px" />,
  document.getElementById("root")!,
);