import { renderThemesDemo } from "./demos/themes/ThemesDemo";

const container = document.getElementById("root")!;
const instance = renderThemesDemo(container, { height: "500px" });
if (instance?.mount) instance.mount();