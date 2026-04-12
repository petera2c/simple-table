import React from "react";
import ReactDOM from "react-dom/client";
import Demo from "./demos/row-height/RowHeightDemo";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Demo height="500px" />
  </React.StrictMode>,
);