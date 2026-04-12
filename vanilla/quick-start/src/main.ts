import { renderQuickStartDemo } from "./demos/quick-start/QuickStartDemo";

const container = document.getElementById("root")!;
const instance = renderQuickStartDemo(container, { height: "500px" });
if (instance?.mount) instance.mount();