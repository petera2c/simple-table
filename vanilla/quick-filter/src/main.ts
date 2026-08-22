import { renderQuickFilterDemo } from "./demos/quick-filter/QuickFilterDemo";

const container = document.getElementById("root")!;
const instance = renderQuickFilterDemo(container, {});
if (instance?.mount) instance.mount();