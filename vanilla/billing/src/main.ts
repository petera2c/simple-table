import { renderBillingDemo } from "./demos/billing/BillingDemo";

const container = document.getElementById("root")!;
container.style.padding = "24px";
renderBillingDemo(container, { height: "500px" });