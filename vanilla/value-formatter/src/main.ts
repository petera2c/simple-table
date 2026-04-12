import { renderValueFormatterDemo } from "./demos/value-formatter/ValueFormatterDemo";

const container = document.getElementById("root")!;
const instance = renderValueFormatterDemo(container, { height: "500px" });
if (instance?.mount) instance.mount();