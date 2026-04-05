import { renderSalesDemo } from "./demos/sales/SalesDemo";

const container = document.getElementById("root")!;
container.style.padding = "24px";
renderSalesDemo(container, { height: "500px" });