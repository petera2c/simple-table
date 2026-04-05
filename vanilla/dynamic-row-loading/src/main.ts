import { renderDynamicRowLoadingDemo } from "./demos/dynamic-row-loading/DynamicRowLoadingDemo";

const container = document.getElementById("root")!;
container.style.padding = "24px";
renderDynamicRowLoadingDemo(container, { height: "500px" });