import { renderColumnAlignmentDemo } from "./demos/column-alignment/ColumnAlignmentDemo";

const container = document.getElementById("root")!;
const instance = renderColumnAlignmentDemo(container, {});
if (instance?.mount) instance.mount();