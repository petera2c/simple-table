import { createApp, defineComponent, h, nextTick, ref, type App } from "vue";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SimpleTable, useTdgpTable } from "../index";
import type { TdgpQueryClient } from "simple-table-core";
import type { VueColumnDef } from "../types";

let host: HTMLDivElement | null = null;
let app: App | null = null;

afterEach(() => {
  app?.unmount();
  app = null;
  host?.remove();
  host = null;
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

const columns: VueColumnDef[] = [
  { accessor: "id", label: "ID", width: 80, type: "number" },
  { accessor: "name", label: "Name", width: 120, type: "string" },
];

describe("useTdgpTable (Vue)", () => {
  it("loads the first page into SimpleTable after mount", async () => {
    const query = vi.fn(async (_dataset: string) => ({
      protocol: "tdgp/1",
      data: [{ id: 1, name: "Ada" }],
      totalCount: 1,
    }));

    const Probe = defineComponent({
      setup() {
        const tdgp = useTdgpTable({
          client: { query } as TdgpQueryClient,
          dataset: "developers-10k",
          columns,
          pageSize: 10,
          primaryKey: "id",
        });
        return () =>
          h(SimpleTable as never, {
            columns: tdgp.columns.value,
            rows: tdgp.rows.value,
            height: "250px",
            theme: "light",
            ...tdgp.tableProps.value,
          });
      },
    });

    host = document.createElement("div");
    document.body.appendChild(host);
    app = createApp(Probe);
    app.mount(host);

    await waitFor(() => query.mock.calls.length === 1 && (host?.textContent?.includes("Ada") ?? false));
    expect(query.mock.calls[0]?.[0]).toBe("developers-10k");
  });

  it("does not reload when options objects are new but the query shape is the same", async () => {
    const query = vi.fn(async (_dataset: string) => ({
      protocol: "tdgp/1",
      data: [{ id: 1, name: "Ada" }],
      totalCount: 1,
    }));

    const bump = ref(0);
    let loading = true;

    const Probe = defineComponent({
      setup() {
        const tdgp = useTdgpTable(() => {
          bump.value;
          return {
            client: { query } as TdgpQueryClient,
            dataset: "developers-10k",
            columns: [
              { accessor: "id", label: "ID", width: 80, type: "number" as const },
              { accessor: "name", label: "Name", width: 120, type: "string" as const },
            ],
            pageSize: 10,
            primaryKey: "id",
          };
        });
        return () => {
          loading = tdgp.isLoading.value;
          return h("div", { "data-loading": String(loading) });
        };
      },
    });

    host = document.createElement("div");
    document.body.appendChild(host);
    app = createApp(Probe);
    app.mount(host);

    await waitFor(() => query.mock.calls.length === 1 && loading === false);
    bump.value += 1;
    await nextTick();
    await wait(40);
    expect(query).toHaveBeenCalledTimes(1);
  });
});
