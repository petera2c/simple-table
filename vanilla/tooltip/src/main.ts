import { renderTooltipDemo } from "./demos/tooltip/TooltipDemo";

const container = document.getElementById("root")!;
const instance = renderTooltipDemo(container, { height: "500px" });
if (instance?.mount) instance.mount();