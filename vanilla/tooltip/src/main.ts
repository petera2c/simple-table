import { renderTooltipDemo } from "./demos/tooltip/TooltipDemo";

const container = document.getElementById("root")!;
const instance = renderTooltipDemo(container, {});
if (instance?.mount) instance.mount();