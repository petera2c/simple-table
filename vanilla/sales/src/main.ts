import { renderSalesDemo } from "./demos/sales/SalesDemo";

const container = document.getElementById("root")!;
const instance = renderSalesDemo(container, { height: "500px" });
if (instance?.mount) instance.mount();