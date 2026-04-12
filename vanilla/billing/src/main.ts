import { renderBillingDemo } from "./demos/billing/BillingDemo";

const container = document.getElementById("root")!;
const instance = renderBillingDemo(container, { height: "500px" });
if (instance?.mount) instance.mount();