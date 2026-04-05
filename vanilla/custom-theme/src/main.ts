import { renderCustomThemeDemo } from "./demos/custom-theme/CustomThemeDemo";

const container = document.getElementById("root")!;
container.style.padding = "24px";
renderCustomThemeDemo(container, { height: "500px" });