import { renderCustomThemeDemo } from "./demos/custom-theme/CustomThemeDemo";

const container = document.getElementById("root")!;
const instance = renderCustomThemeDemo(container, { height: "500px" });
if (instance?.mount) instance.mount();