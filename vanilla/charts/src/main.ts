import { renderChartsDemo } from "./demos/charts/ChartsDemo";

const container = document.getElementById("root")!;
const instance = renderChartsDemo(container, {});
if (instance?.mount) instance.mount();