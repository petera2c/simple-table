import { renderNestedHeadersDemo } from "./demos/nested-headers/NestedHeadersDemo";

const container = document.getElementById("root")!;
const instance = renderNestedHeadersDemo(container, { height: "500px" });
if (instance?.mount) instance.mount();