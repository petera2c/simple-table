import React from "react";
import ReactDOM from "react-dom/client";
import Demo from "./demos/header-renderer/HeaderRendererDemo";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <div style={{ padding: "24px" }}>
      <Demo height="500px" />
    </div>
  </React.StrictMode>,
);