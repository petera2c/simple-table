import React from "react";
import ReactDOM from "react-dom/client";
import Demo from "./demos/column-reordering/ColumnReorderingDemo";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Demo height="500px" />
  </React.StrictMode>,
);