import { renderChartsDemo } from "./demos/charts/ChartsDemo";

const container = document.getElementById("root")!;
container.style.padding = "24px";
renderChartsDemo(container, { height: "500px" });