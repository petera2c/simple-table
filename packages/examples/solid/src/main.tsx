import { render, Dynamic } from "solid-js/web";
import { lazy, Suspense, createSignal, Show, onMount, onCleanup } from "solid-js";
import { DEMO_LIST } from "@simple-table/examples-shared";
import type { Theme } from "simple-table-solid";
import "../../shared/src/styles/shell.css";

const registry: Record<string, ReturnType<typeof lazy>> = {
  "quick-start": lazy(() => import("./demos/quick-start/QuickStartDemo")),
  "column-filtering": lazy(() => import("./demos/column-filtering/ColumnFilteringDemo")),
  "column-sorting": lazy(() => import("./demos/column-sorting/ColumnSortingDemo")),
  "value-formatter": lazy(() => import("./demos/value-formatter/ValueFormatterDemo")),
  "pagination": lazy(() => import("./demos/pagination/PaginationDemo")),
};

function App() {
  const params = new URLSearchParams(window.location.search);
  const height = params.get("height") || undefined;
  const theme = (params.get("theme") as Theme) || undefined;

  const [activeDemo, setActiveDemo] = createSignal(
    params.get("demo") || "quick-start"
  );

  function selectDemo(id: string) {
    setActiveDemo(id);
    const url = new URL(window.location.href);
    url.searchParams.set("demo", id);
    window.history.pushState({}, "", url);
  }

  const handlePopState = () => {
    setActiveDemo(
      new URLSearchParams(window.location.search).get("demo") || "quick-start"
    );
  };

  onMount(() => window.addEventListener("popstate", handlePopState));
  onCleanup(() => window.removeEventListener("popstate", handlePopState));

  return (
    <div class="examples-shell">
      <aside class="examples-sidebar">
        <div class="examples-sidebar-header">Solid Examples</div>
        <nav>
          <ul class="examples-sidebar-nav">
            {DEMO_LIST.map((demo) => (
              <li>
                <button
                  class="examples-sidebar-link"
                  classList={{ active: activeDemo() === demo.id }}
                  onClick={() => selectDemo(demo.id)}
                >
                  {demo.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main class="examples-content">
        <Show
          when={registry[activeDemo()]}
          keyed
          fallback={<h2>Unknown demo: {activeDemo()}</h2>}
        >
          {(DemoComp) => (
            <Suspense fallback={<div>Loading...</div>}>
              <DemoComp height={height} theme={theme} />
            </Suspense>
          )}
        </Show>
      </main>
    </div>
  );
}

render(App, document.getElementById("root")!);
