import { renderDynamicRowLoadingDemo } from "./demos/dynamic-row-loading/DynamicRowLoadingDemo";

const container = document.getElementById("root")!;
const instance = renderDynamicRowLoadingDemo(container, { height: "500px" });
if (instance?.mount) instance.mount();