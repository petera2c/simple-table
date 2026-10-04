import { renderThemesDemo } from "./demos/themes/ThemesDemo";

const container = document.getElementById("root")!;
const instance = renderThemesDemo(container, {});
if (instance?.mount) instance.mount();