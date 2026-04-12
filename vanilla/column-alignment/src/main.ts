import { renderColumnAlignmentDemo } from "./demos/column-alignment/ColumnAlignmentDemo";

const container = document.getElementById("root")!;
const instance = renderColumnAlignmentDemo(container, { height: "500px" });
if (instance?.mount) instance.mount();