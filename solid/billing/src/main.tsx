import { render } from "solid-js/web";
import Demo from "./demos/billing/BillingDemo";

render(
  () => <Demo height="500px" />,
  document.getElementById("root")!,
);