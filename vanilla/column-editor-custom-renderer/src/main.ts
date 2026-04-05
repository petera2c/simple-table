import { renderColumnEditorCustomRendererDemo } from "./demos/column-editor-custom-renderer/ColumnEditorCustomRendererDemo";

const container = document.getElementById("root")!;
container.style.padding = "24px";
renderColumnEditorCustomRendererDemo(container, { height: "500px" });