import { renderColumnEditorCustomRendererDemo } from "./demos/column-editor-custom-renderer/ColumnEditorCustomRendererDemo";

const container = document.getElementById("root")!;
const instance = renderColumnEditorCustomRendererDemo(container, {});
if (instance?.mount) instance.mount();