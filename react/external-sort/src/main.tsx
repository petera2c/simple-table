import React from "react";
import ReactDOM from "react-dom/client";
import Demo from "./demos/external-sort/ExternalSortDemo";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <div style={{ padding: "24px" }}>
      <Demo height="500px" />
    </div>
  </React.StrictMode>,
);