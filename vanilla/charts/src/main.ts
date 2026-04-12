import { renderChartsDemo } from "./demos/charts/ChartsDemo";

const container = document.getElementById("root")!;
const instance = renderChartsDemo(container, { height: "500px" });
if (instance?.mount) instance.mount();