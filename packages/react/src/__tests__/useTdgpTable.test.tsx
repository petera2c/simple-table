import { createElement, useState } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useTdgpTable } from "../tdgp/useTdgpTable";
import type { TdgpQueryClient } from "simple-table-core";

let container: HTMLDivElement | null = null;
let root: Root | null = null;

afterEach(() => {
  root?.unmount();
  root = null;
  container?.remove();
  container = null;
  vi.restoreAllMocks();
});

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitFor(predicate: () => boolean, timeoutMs = 2000): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (predicate()) return;
    await wait(20);
  }
  throw new Error("Timed out waiting for condition");
}

function mount(node: React.ReactElement): HTMLDivElement {
  const host = document.createElement("div");
  document.body.appendChild(host);
  container = host;
  root = createRoot(host);
  root.render(node);
  return host;
}

describe("useTdgpTable", () => {
  it("does not reload when the parent re-renders with new client and columns objects", async () => {
    const query = vi.fn(async () => ({
      protocol: "tdgp/1",
      data: [{ id: 1, name: "Ada" }],
      totalCount: 1,
    }));

    function Probe({ bump }: { bump: number }) {
      const client = { query } as TdgpQueryClient;
      const columns = [
        { accessor: "id", label: "ID", width: 80, type: "number" as const },
        { accessor: "name", label: "Name", width: 120, type: "string" as const },
      ];
      const snapshot = useTdgpTable({
        client,
        dataset: "developers-10k",
        columns,
        pageSize: 10,
      });
      return createElement("div", { "data-bump": bump, "data-loading": String(snapshot.isLoading) });
    }

    function Harness() {
      const [bump, setBump] = useState(0);
      return createElement(
        "div",
        null,
        createElement("button", { className: "rerender", onClick: () => setBump((n) => n + 1) }, "again"),
        createElement(Probe, { bump }),
      );
    }

    const host = mount(createElement(Harness));
    await waitFor(() => query.mock.calls.length === 1 && host.querySelector("[data-loading='false']") != null);
    expect(query).toHaveBeenCalledTimes(1);

    host.querySelector("button.rerender")?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await waitFor(() => host.querySelector("[data-bump='1']") != null);
    await wait(40);

    expect(query).toHaveBeenCalledTimes(1);
  });
});
