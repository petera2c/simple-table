import { renderQuickStartDemo } from "./demos/quick-start/QuickStartDemo";

const container = document.getElementById("root")!;
const instance = renderQuickStartDemo(container, {});
if (instance?.mount) instance.mount();