import { renderProgrammaticControlDemo } from "./demos/programmatic-control/ProgrammaticControlDemo";

const container = document.getElementById("root")!;
const instance = renderProgrammaticControlDemo(container, {});
if (instance?.mount) instance.mount();