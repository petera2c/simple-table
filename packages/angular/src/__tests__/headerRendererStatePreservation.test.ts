import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  ViewChild,
} from "@angular/core";
import { afterEach, describe, expect, it } from "vitest";
import type { AngularColumnDef, HeaderRendererProps } from "../index";
import {
  mountAngularTable,
  wait,
  waitFor,
  type MountedTestTable,
} from "./testUtils";

/**
 * Regression: sort/filter icon refresh must not tear down an Angular
 * headerRenderer. Core re-invokes the renderer with new `components.*` icons;
 * the adapter must return the same host and update inputs in place so local
 * state survives. Mirrors packages/vue/.../headerRendererStatePreservation.test.ts.
 */

const STATE_ATTR = "data-st-test-header-clicks";
const TOGGLE_ATTR = "data-st-test-header-toggle";

let mountCount = 0;

@Component({
  standalone: true,
  selector: "st-test-stateful-header",
  template: `
    <span class="stateful-custom-head" [attr.data-st-test-header-clicks]="clicks">
      {{ header.label }}
      <button
        type="button"
        [attr.data-st-test-header-toggle]="true"
        (click)="onToggle($event)"
      >
        toggle
      </button>
      <span #icons></span>
    </span>
  `,
})
class StatefulHeaderComponent implements OnInit, OnChanges {
  @Input({ required: true }) header!: HeaderRendererProps["header"];
  @Input() components?: HeaderRendererProps["components"];
  @ViewChild("icons", { static: true }) icons!: ElementRef<HTMLElement>;

  clicks = 0;

  ngOnInit(): void {
    mountCount += 1;
    this.syncIcons();
  }

  ngOnChanges(): void {
    this.syncIcons();
  }

  onToggle(event: Event): void {
    event.stopPropagation();
    this.clicks += 1;
  }

  private syncIcons(): void {
    const host = this.icons?.nativeElement;
    if (!host) return;
    host.replaceChildren();
    for (const node of [
      this.components?.sortIcon,
      this.components?.filterIcon,
      this.components?.labelContent,
    ]) {
      if (node instanceof HTMLElement) host.appendChild(node);
    }
  }
}

let unstableHeaderSeq = 0;

/** New component class identity each call — unstable columns churn. */
function createUnstableScoreHeader(): typeof StatefulHeaderComponent {
  const selector = `st-test-unstable-score-header-${unstableHeaderSeq++}`;
  @Component({
    standalone: true,
    selector,
    template: `
      <st-test-stateful-header [header]="header" [components]="components" />
    `,
    imports: [StatefulHeaderComponent],
  })
  class UnstableScoreHeaderComponent {
    @Input({ required: true }) header!: HeaderRendererProps["header"];
    @Input() components?: HeaderRendererProps["components"];
  }
  return UnstableScoreHeaderComponent as unknown as typeof StatefulHeaderComponent;
}

const rows = [
  { id: 1, name: "Alice", score: 10 },
  { id: 2, name: "Bob", score: 20 },
];

let mounted: MountedTestTable | null = null;

afterEach(() => {
  mounted?.destroy();
  mounted = null;
  mountCount = 0;
  unstableHeaderSeq = 0;
});

function findHeaderLabel(scope: HTMLElement, labelText: string): HTMLElement {
  const labels = Array.from(scope.querySelectorAll<HTMLElement>(".st-header-label"));
  const label = labels.find((el) => el.textContent?.includes(labelText));
  if (!label) throw new Error(`${labelText} header label not found`);
  return label;
}

function readStatefulHeader(scope: HTMLElement): HTMLElement {
  const el = scope.querySelector<HTMLElement>(".stateful-custom-head");
  if (!el) throw new Error("Stateful header not found");
  return el;
}

async function setLocalHeaderState(scope: HTMLElement): Promise<void> {
  await waitFor(() => scope.querySelector(".stateful-custom-head") !== null);
  expect(mountCount).toBe(1);

  const toggle = scope.querySelector<HTMLButtonElement>(`[${TOGGLE_ATTR}]`);
  expect(toggle).toBeTruthy();
  toggle!.click();
  await waitFor(() => readStatefulHeader(scope).getAttribute(STATE_ATTR) === "1");
}

describe("SimpleTable (Angular adapter) — headerRenderer state across sort/filter", () => {
  it("preserves Angular header state when the column sort toggles", async () => {
    const columns: AngularColumnDef[] = [
      { accessor: "name", label: "Name", width: 120, type: "string" },
      {
        accessor: "score",
        label: "Score",
        width: 140,
        type: "number",
        sortable: true,
        headerRenderer: StatefulHeaderComponent,
      },
    ];

    mounted = await mountAngularTable({ columns, rows });
    await setLocalHeaderState(mounted.el);

    const headerLabel = findHeaderLabel(mounted.el, "Score");
    headerLabel.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    await waitFor(
      () =>
        mounted!.el.querySelector(
          '.stateful-custom-head .st-icon-container[aria-label*="Sort"]',
        ) !== null,
    );
    await wait(50);

    expect(mountCount).toBe(1);
    expect(readStatefulHeader(mounted.el).getAttribute(STATE_ATTR)).toBe("1");

    headerLabel.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await waitFor(
      () =>
        mounted!.el
          .querySelector('.stateful-custom-head .st-icon-container[aria-label*="Sort"]')
          ?.getAttribute("aria-label")
          ?.includes("ascending") === true,
    );
    await wait(50);

    expect(mountCount).toBe(1);
    expect(readStatefulHeader(mounted.el).getAttribute(STATE_ATTR)).toBe("1");
  });

  it("preserves Angular header state when a filter is applied on the column", async () => {
    const columns: AngularColumnDef[] = [
      { accessor: "name", label: "Name", width: 120, type: "string" },
      {
        accessor: "score",
        label: "Score",
        width: 160,
        type: "number",
        filterable: true,
        headerRenderer: StatefulHeaderComponent,
      },
    ];

    mounted = await mountAngularTable({ columns, rows });
    await setLocalHeaderState(mounted.el);
    await waitFor(() => mounted!.host.api != null);

    await mounted.host.api!.applyFilter({
      accessor: "score",
      operator: "equals",
      value: 10,
    });
    await wait(50);

    expect(mountCount).toBe(1);
    expect(readStatefulHeader(mounted.el).getAttribute(STATE_ATTR)).toBe("1");
  });
});

describe("SimpleTable (Angular adapter) — unstable columns / rows refs", () => {
  it("preserves Angular header state when columns is rebuilt with the same structure", async () => {
    function buildColumns(): AngularColumnDef[] {
      return [
        { accessor: "name", label: "Name", width: 120, type: "string" },
        {
          accessor: "score",
          label: "Score",
          width: 140,
          type: "number",
          sortable: true,
          headerRenderer: createUnstableScoreHeader(),
        },
      ];
    }

    mounted = await mountAngularTable({
      columns: buildColumns(),
      rows,
    });
    await setLocalHeaderState(mounted.el);

    mounted.setState({
      columns: buildColumns(),
      rows: rows.map((r) => ({ ...r })),
    });
    mounted.setState({
      columns: buildColumns(),
      rows: rows.map((r) => ({ ...r })),
    });
    mounted.setState({
      columns: buildColumns(),
      rows: rows.map((r) => ({ ...r })),
    });
    await wait(80);

    expect(mountCount).toBe(1);
    expect(readStatefulHeader(mounted.el).getAttribute(STATE_ATTR)).toBe("1");
  });
});
