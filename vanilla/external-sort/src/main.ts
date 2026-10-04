import { renderExternalSortDemo } from "./demos/external-sort/ExternalSortDemo";

const container = document.getElementById("root")!;
const instance = renderExternalSortDemo(container, {});
if (instance?.mount) instance.mount();