import { renderSoccerDemo } from "./demos/soccer/SoccerDemo";

const container = document.getElementById("root")!;
const instance = renderSoccerDemo(container, {});
if (instance?.mount) instance.mount();