import React from "react";
import ReactDOM from "react-dom/client";
import Demo from "./demos/header-renderer/HeaderRendererDemo";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Demo height="500px" />
  </React.StrictMode>,
);