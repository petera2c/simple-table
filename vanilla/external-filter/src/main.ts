import { renderExternalFilterDemo } from "./demos/external-filter/ExternalFilterDemo";

const container = document.getElementById("root")!;
const instance = renderExternalFilterDemo(container, { height: "500px" });
if (instance?.mount) instance.mount();