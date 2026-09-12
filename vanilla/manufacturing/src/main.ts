import { renderManufacturingDemo } from "./demos/manufacturing/ManufacturingDemo";

const container = document.getElementById("root")!;
const instance = renderManufacturingDemo(container, {});
if (instance?.mount) instance.mount();