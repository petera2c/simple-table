import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  DimensionManager,
  CONTAINER_RESIZE_NOTIFY_DEBOUNCE_MS,
  CONTAINER_RESIZE_BURST_END_MS,
} from "../../../core/src/managers/DimensionManager";
import { RenderOrchestrator } from "../../../core/src/core/rendering/RenderOrchestrator";
import { SimpleTableVanilla } from "simple-table-core";
import type { ColumnDef, Row } from "simple-table-core";

/**
 * Container-resize performance during animated layout shifts (e.g. a collapsible
 * global left nav squeezing the main content area).
 *
 * Desired behaviour: coalesce stepped ResizeObserver callbacks during a CSS
 * transition so DimensionManager subscribers and full table renders fire at
 * most once or twice for the whole animation — not once per animation frame.
 */

async function flushResizeSettle(): Promise<void> {
  await new Promise<void>((resolve) =>
    setTimeout(
      resolve,
      CONTAINER_RESIZE_NOTIFY_DEBOUNCE_MS + CONTAINER_RESIZE_BURST_END_MS + 20,
    ),
  );
}

async function flushRaf(rounds = 2): Promise<void> {
  for (let i = 0; i < rounds; i++) {
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
  }
}

/** ResizeObserver we can fire manually to simulate layout animation frames. */
class ControllableResizeObserver {
  static instances: ControllableResizeObserver[] = [];
  private callback: ResizeObserverCallback;

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
    ControllableResizeObserver.instances.push(this);
  }

  observe(): void {
    queueMicrotask(() => this.callback([], this as unknown as ResizeObserver));
  }

  trigger(): void {
    this.callback([], this as unknown as ResizeObserver);
  }

  unobserve(): void {}

  disconnect(): void {
    ControllableResizeObserver.instances = ControllableResizeObserver.instances.filter(
      (instance) => instance !== this,
    );
  }
}

function defineClientWidth(element: HTMLElement, getWidth: () => number): void {
  Object.defineProperty(element, "clientWidth", {
    configurable: true,
    get: getWidth,
  });
}

const PLATFORM_METRICS = [
  "streams",
  "listeners",
  "followers",
  "saves",
  "shares",
  "playlistAdds",
  "revenue",
  "rpm",
  "ctr",
  "impressions",
  "clicks",
  "conversions",
] as const;

const createPlatformHeaders = (): ColumnDef[] => [
  { accessor: "id", label: "ID", width: 64, pinned: "left", type: "number" },
  { accessor: "platform", label: "Platform", width: 140, pinned: "left", type: "string" },
  { accessor: "territory", label: "Territory", width: 100, type: "string" },
  ...PLATFORM_METRICS.map((metric) => ({
    accessor: metric,
    label: metric.charAt(0).toUpperCase() + metric.slice(1),
    width: 120,
    align: "right" as const,
    type: "number" as const,
  })),
];

const createPlatformRows = (count: number): Row[] =>
  Array.from({ length: count }, (_, index) => {
    const row: Row = {
      id: index + 1,
      platform: ["Spotify", "Apple Music", "YouTube"][index % 3],
      territory: ["US", "UK", "DE"][index % 3],
    };
    PLATFORM_METRICS.forEach((metric, metricIndex) => {
      row[metric] = Math.round((index + 1) * (metricIndex + 2) * 137.5);
    });
    return row;
  });

let originalResizeObserver: typeof ResizeObserver;

beforeEach(() => {
  originalResizeObserver = globalThis.ResizeObserver;
  ControllableResizeObserver.instances = [];
  globalThis.ResizeObserver = ControllableResizeObserver as unknown as typeof ResizeObserver;
});

afterEach(() => {
  globalThis.ResizeObserver = originalResizeObserver;
  ControllableResizeObserver.instances = [];
});

describe("DimensionManager — animated container resize", () => {
  it("coalesces stepped width changes into at most two subscriber notifications", async () => {
    const container = document.createElement("div");
    let width = 1200;
    defineClientWidth(container, () => width);

    const notifications: number[] = [];

    const manager = new DimensionManager({
      effectiveHeaders: [{ accessor: "name", label: "Name", width: 200 }],
      rowHeight: 32,
      totalRowCount: 20,
      containerElement: container,
    });

    manager.subscribe((state) => notifications.push(state.containerWidth));

    try {
      await flushRaf();
      const baselineCount = notifications.length;

      // 240px nav collapse spread across ~12 animation frames.
      const steps = [1180, 1160, 1140, 1120, 1100, 1080, 1060, 1040, 1020, 1000, 980, 960];
      for (const nextWidth of steps) {
        width = nextWidth;
        ControllableResizeObserver.instances.forEach((observer) => observer.trigger());
        await flushRaf();
      }

      await flushResizeSettle();

      const resizeNotifications = notifications.length - baselineCount;

      // Coalesced: one notification at settle (two max if a mid-animation pass is kept).
      expect(resizeNotifications).toBeLessThanOrEqual(2);
      expect(notifications.at(-1)).toBe(960);
    } finally {
      manager.destroy();
    }
  });
});

describe("SimpleTableVanilla — container resize relayout churn", () => {
  let host: HTMLDivElement | null = null;
  let instance: SimpleTableVanilla | null = null;
  let renderSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    renderSpy = vi.spyOn(RenderOrchestrator.prototype, "render");
  });

  afterEach(() => {
    renderSpy.mockRestore();
    instance?.destroy();
    instance = null;
    host?.remove();
    host = null;
  });

  it("coalesces stepped resize into at most two full renders when autoExpandColumns is on", async () => {
    host = document.createElement("div");
    document.body.appendChild(host);

    let containerWidth = 1200;

    instance = new SimpleTableVanilla(host, {
      columns: createPlatformHeaders(),
      rows: createPlatformRows(30),
      getRowId: (p) => String((p.row as { id?: number }).id),
      maxHeight: "400px",
      autoExpandColumns: true,
    });
    instance.mount();

    const bodyContainer = host.querySelector(".st-body-container") as HTMLElement | null;
    expect(bodyContainer).not.toBeNull();
    defineClientWidth(bodyContainer!, () => containerWidth);

    await flushRaf();
    renderSpy.mockClear();

    const steps = [1180, 1160, 1140, 1120, 1100, 1080, 1060, 1040, 1020, 1000, 980, 960];
    for (const nextWidth of steps) {
      containerWidth = nextWidth;
      ControllableResizeObserver.instances.forEach((observer) => observer.trigger());
      await flushRaf();
    }

    await flushResizeSettle();

    // Coalesced: one render at settle (two max if a mid-animation pass is kept).
    expect(renderSpy.mock.calls.length).toBeLessThanOrEqual(2);
  });
});
