import { renderSalesDemo } from "./demos/sales/SalesDemo";

const container = document.getElementById("root")!;
const instance = renderSalesDemo(container, {});
if (instance?.mount) instance.mount();