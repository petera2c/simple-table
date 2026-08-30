import { renderDynamicRowLoadingDemo } from "./demos/dynamic-row-loading/DynamicRowLoadingDemo";

const container = document.getElementById("root")!;
const instance = renderDynamicRowLoadingDemo(container, {});
if (instance?.mount) instance.mount();