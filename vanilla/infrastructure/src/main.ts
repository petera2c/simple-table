import { renderInfrastructureDemo } from "./demos/infrastructure/InfrastructureDemo";

const container = document.getElementById("root")!;
const instance = renderInfrastructureDemo(container, {});
if (instance?.mount) instance.mount();