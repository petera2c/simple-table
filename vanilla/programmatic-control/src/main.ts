import { renderProgrammaticControlDemo } from "./demos/programmatic-control/ProgrammaticControlDemo";

const container = document.getElementById("root")!;
container.style.padding = "24px";
renderProgrammaticControlDemo(container, { height: "500px" });