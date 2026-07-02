import { renderExternalFilterDemo } from "./demos/external-filter/ExternalFilterDemo";

const container = document.getElementById("root")!;
const instance = renderExternalFilterDemo(container, {});
if (instance?.mount) instance.mount();