import { renderColumnEditorCustomRendererDemo } from "./demos/column-editor-custom-renderer/ColumnEditorCustomRendererDemo";

const container = document.getElementById("root")!;
const instance = renderColumnEditorCustomRendererDemo(container, { height: "500px" });
if (instance?.mount) instance.mount();