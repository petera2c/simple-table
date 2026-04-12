import { renderQuickFilterDemo } from "./demos/quick-filter/QuickFilterDemo";

const container = document.getElementById("root")!;
const instance = renderQuickFilterDemo(container, { height: "500px" });
if (instance?.mount) instance.mount();