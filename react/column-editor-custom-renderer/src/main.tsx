import React from "react";
import ReactDOM from "react-dom/client";
import Demo from "./demos/column-editor-custom-renderer/ColumnEditorCustomRendererDemo";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Demo height="500px" />
  </React.StrictMode>,
);