import { renderInfrastructureDemo } from "./demos/infrastructure/InfrastructureDemo";

const container = document.getElementById("root")!;
const instance = renderInfrastructureDemo(container, { height: "500px" });
if (instance?.mount) instance.mount();