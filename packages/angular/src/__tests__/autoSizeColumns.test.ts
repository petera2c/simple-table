import { Component, Input } from "@angular/core";
import { afterEach, describe, expect, it } from "vitest";
import type { AngularColumnDef, HeaderRendererProps } from "../index";
import {
  mountAngularTable,
  wait,
  waitForText,
  type MountedTestTable,
} from "./testUtils";

/**
 * jsdom has no layout engine, so width assertions live in core browser stories.
 * This suite guards the Angular integration: `width: "auto"` + custom renderers
 * must mount through the post-mount / leave-loading re-fit path without throwing.
 * Mirrors packages/vue/src/__tests__/autoSizeColumns.test.ts.
 */

@Component({
  standalone: true,
  selector: "st-test-status-badge",
  template: `<span class="status-badge">status:{{ value }}</span>`,
})
class StatusBadgeComponent {
  @Input() value?: unknown;
}

@Component({
  standalone: true,
  selector: "st-test-custom-header",
  template: `<span class="custom-head">head:{{ header.label }}</span>`,
})
class CustomHeaderComponent {
  @Input({ required: true }) header!: HeaderRendererProps["header"];
}

const headers: AngularColumnDef[] = [
  { accessor: "id", label: "ID", width: 80, type: "number" },
  {
    accessor: "status",
    label: "Status",
    width: "auto",
    type: "string",
    cellRenderer: StatusBadgeComponent,
  },
];

const rows = [
  { id: 1, status: "active" },
  { id: 2, status: "pending" },
];

let mounted: MountedTestTable | null = null;

afterEach(() => {
  mounted?.destroy();
  mounted = null;
});

describe("SimpleTable (Angular adapter) — auto-size columns", () => {
  it("renders a width:'auto' column that uses an Angular cellRenderer", async () => {
    mounted = await mountAngularTable({ columns: headers, rows });
    await waitForText(mounted.el, "status:active");
    expect(mounted.el.querySelectorAll(".status-badge").length).toBeGreaterThan(0);
  });

  it("re-fits without error when row data changes", async () => {
    mounted = await mountAngularTable({ columns: headers, rows });
    await waitForText(mounted.el, "status:active");

    mounted.setState({
      rows: [
        { id: 1, status: "archived" },
        { id: 2, status: "active" },
      ],
    });
    await waitForText(mounted.el, "status:archived");
    expect(mounted.el.querySelectorAll(".status-badge").length).toBeGreaterThan(0);
  });

  it("re-fits without error when leaving isLoading", async () => {
    mounted = await mountAngularTable({
      columns: headers,
      rows: [],
      isLoading: true,
    });
    await wait(60);

    mounted.setState({ isLoading: false, rows });
    await waitForText(mounted.el, "status:active");
    expect(mounted.el.querySelectorAll(".status-badge").length).toBeGreaterThan(0);
  });

  it("renders a width:'auto' column that uses an Angular headerRenderer", async () => {
    const customHeaders: AngularColumnDef[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      {
        accessor: "status",
        label: "Status",
        width: "auto",
        type: "string",
        headerRenderer: CustomHeaderComponent,
      },
    ];

    mounted = await mountAngularTable({ columns: customHeaders, rows });
    await waitForText(mounted.el, "head:Status");
    expect(mounted.el.querySelectorAll(".custom-head").length).toBeGreaterThan(0);
  });
});
