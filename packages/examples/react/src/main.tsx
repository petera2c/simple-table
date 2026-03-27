import React, { Suspense, lazy, useState, useEffect, useCallback } from "react";
import { createRoot } from "react-dom/client";
import { DEMO_LIST } from "@simple-table/examples-shared";
import { registry } from "./registry";
import type { DemoProps } from "./registry";
import "../../shared/src/styles/shell.css";

const lazyComponents = Object.fromEntries(
  Object.entries(registry).map(([key, loader]) => [key, lazy(loader)])
);

const params = new URLSearchParams(window.location.search);
const height = params.get("height") || undefined;
const theme = (params.get("theme") as DemoProps["theme"]) || undefined;

function App() {
  const [activeDemo, setActiveDemo] = useState(
    () => new URLSearchParams(window.location.search).get("demo") || "quick-start"
  );

  useEffect(() => {
    const handlePopState = () => {
      setActiveDemo(
        new URLSearchParams(window.location.search).get("demo") || "quick-start"
      );
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const selectDemo = useCallback((id: string) => {
    setActiveDemo(id);
    const url = new URL(window.location.href);
    url.searchParams.set("demo", id);
    window.history.pushState({}, "", url);
  }, []);

  const Demo = lazyComponents[activeDemo];

  return (
    <div className="examples-shell">
      <aside className="examples-sidebar">
        <div className="examples-sidebar-header">React Examples</div>
        <nav>
          <ul className="examples-sidebar-nav">
            {DEMO_LIST.map((demo) => (
              <li key={demo.id}>
                <button
                  className={`examples-sidebar-link${activeDemo === demo.id ? " active" : ""}`}
                  onClick={() => selectDemo(demo.id)}
                >
                  {demo.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main className="examples-content">
        {Demo ? (
          <Suspense fallback={<div>Loading...</div>}>
            <Demo height={height} theme={theme} />
          </Suspense>
        ) : (
          <h2>Unknown demo: {activeDemo}</h2>
        )}
      </main>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
