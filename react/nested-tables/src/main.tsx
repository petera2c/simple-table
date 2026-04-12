import React from "react";
import ReactDOM from "react-dom/client";
import Demo from "./demos/nested-tables/NestedTablesDemo";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Demo height="500px" />
  </React.StrictMode>,
);