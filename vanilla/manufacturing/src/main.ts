import { renderManufacturingDemo } from "./demos/manufacturing/ManufacturingDemo";

const container = document.getElementById("root")!;
const instance = renderManufacturingDemo(container, { height: "500px" });
if (instance?.mount) instance.mount();