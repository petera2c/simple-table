import { renderExternalSortDemo } from "./demos/external-sort/ExternalSortDemo";

const container = document.getElementById("root")!;
const instance = renderExternalSortDemo(container, { height: "500px" });
if (instance?.mount) instance.mount();