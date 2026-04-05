import { renderManufacturingDemo } from "./demos/manufacturing/ManufacturingDemo";

const container = document.getElementById("root")!;
container.style.padding = "24px";
renderManufacturingDemo(container, { height: "500px" });