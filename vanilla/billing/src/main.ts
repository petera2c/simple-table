import { renderBillingDemo } from "./demos/billing/BillingDemo";

const container = document.getElementById("root")!;
const instance = renderBillingDemo(container, {});
if (instance?.mount) instance.mount();