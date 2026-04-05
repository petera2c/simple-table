import { renderTooltipDemo } from "./demos/tooltip/TooltipDemo";

const container = document.getElementById("root")!;
container.style.padding = "24px";
renderTooltipDemo(container, { height: "500px" });