import { renderQuickStartDemo } from "./demos/quick-start/QuickStartDemo";

const container = document.getElementById("root")!;
container.style.padding = "24px";
renderQuickStartDemo(container, { height: "500px" });