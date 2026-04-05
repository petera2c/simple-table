import { renderInfrastructureDemo } from "./demos/infrastructure/InfrastructureDemo";

const container = document.getElementById("root")!;
container.style.padding = "24px";
renderInfrastructureDemo(container, { height: "500px" });