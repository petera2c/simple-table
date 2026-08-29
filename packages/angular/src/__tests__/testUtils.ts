import "zone.js";
import "@angular/compiler";
import {
  ApplicationRef,
  Component,
  InjectionToken,
  inject,
  provideZoneChangeDetection,
  reflectComponentType,
  type ComponentRef,
  type EnvironmentProviders,
  type Provider,
  type Type,
} from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { SimpleTableComponent, provideSimpleTable } from "../index";
import type {
  AngularColumnDef,
  AngularDefaultRowData,
  SimpleTableAngularProps,
  TableAPI,
} from "../index";

export const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function waitFor(
  predicate: () => boolean,
  timeoutMs = 3000,
  label = "condition",
): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (predicate()) return;
    await wait(20);
  }
  throw new Error(`Timed out waiting for ${label}`);
}

export async function waitForElement(
  scope: HTMLElement,
  selector: string,
  timeoutMs = 3000,
): Promise<HTMLElement> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const el = scope.querySelector<HTMLElement>(selector);
    if (el) return el;
    await wait(20);
  }
  throw new Error(`Timed out waiting for element: ${selector}`);
}

export async function waitForText(
  scope: HTMLElement,
  text: string,
  timeoutMs = 3000,
): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (scope.textContent?.includes(text)) return;
    await wait(20);
  }
  throw new Error(`Timed out waiting for text: ${text}`);
}

/** Mutable test state; `TData` is inferred from `mountAngularTable` props. */
export type TestTableState<TData extends AngularDefaultRowData = AngularDefaultRowData> = {
  rows: TData[];
  columns: ReadonlyArray<AngularColumnDef<TData>>;
  isLoading?: boolean;
  onSortChange?: (...args: unknown[]) => void;
  onColumnSelect?: (...args: unknown[]) => void;
  getRowId?: SimpleTableAngularProps<TData>["getRowId"];
  height?: string;
  theme?: SimpleTableAngularProps<TData>["theme"];
  hideHeader?: boolean;
  className?: string;
  selectableColumns?: boolean;
  enableRowSelection?: boolean;
  selectRowOnClick?: boolean;
  tableEmptyStateRenderer?: SimpleTableAngularProps<TData>["tableEmptyStateRenderer"];
};

const TEST_TABLE_STATE = new InjectionToken<TestTableState>("st-angular-test-table-state");

@Component({
  standalone: true,
  imports: [SimpleTableComponent],
  selector: "st-angular-test-host",
  template: `
    <simple-table
      [rows]="state.rows"
      [columns]="state.columns"
      [getRowId]="state.getRowId"
      [height]="state.height"
      [theme]="state.theme"
      [isLoading]="state.isLoading"
      [onSortChange]="state.onSortChange"
      [onColumnSelect]="state.onColumnSelect"
      [hideHeader]="state.hideHeader"
      [className]="state.className"
      [selectableColumns]="state.selectableColumns"
      [enableRowSelection]="state.enableRowSelection"
      [selectRowOnClick]="state.selectRowOnClick"
      [tableEmptyStateRenderer]="state.tableEmptyStateRenderer"
      (tableReady)="onTableReady($event)"
    />
  `,
})
export class AngularTestHost {
  readonly state = inject(TEST_TABLE_STATE);
  api: TableAPI | null = null;

  onTableReady(api: TableAPI): void {
    this.api = api;
  }
}

export type MountedTestTable<TData extends AngularDefaultRowData = AngularDefaultRowData> = {
  el: HTMLElement;
  host: AngularTestHost;
  hostRef: ComponentRef<AngularTestHost>;
  appRef: ApplicationRef;
  destroy: () => void;
  setState: (patch: Partial<TestTableState<TData>>) => void;
};

/**
 * Bootstraps a minimal Angular app hosting SimpleTableComponent.
 * Mutate via `setState` so child `@Input` / `ngOnChanges` sync runs.
 * `TData` is inferred from `initial.rows` / `initial.columns`.
 */
export async function mountAngularTable<TData extends AngularDefaultRowData>(
  initial: TestTableState<TData>,
): Promise<MountedTestTable<TData>> {
  const state: TestTableState<TData> = {
    height: "250px",
    theme: "light",
    getRowId: ({ row }) => String((row as { id?: string | number; name?: string }).id ?? (row as { name?: string }).name ?? ""),
    ...initial,
  };

  const el = document.createElement("st-angular-test-host");
  document.body.appendChild(el);

  const appRef = await bootstrapApplication(AngularTestHost, {
    providers: [
      provideZoneChangeDetection(),
      provideSimpleTable(),
      { provide: TEST_TABLE_STATE, useValue: state },
    ],
  });
  const hostRef = appRef.components[0] as ComponentRef<AngularTestHost>;

  return {
    el,
    host: hostRef.instance,
    hostRef,
    appRef,
    destroy: () => {
      appRef.destroy();
      el.remove();
    },
    setState: (patch) => {
      Object.assign(state, patch);
      hostRef.changeDetectorRef.detectChanges();
      appRef.tick();
    },
  };
}

export type MountedConsumer<T> = {
  el: HTMLElement;
  instance: T;
  appRef: ApplicationRef;
  destroy: () => void;
  detectChanges: () => void;
};

/**
 * Bootstraps a real page component (`imports: [SimpleTableImports]`, template
 * with `<simple-table>`). Does not go through `AngularTestHost`.
 */
export async function mountConsumer<T extends object>(
  component: Type<T>,
  options?: { providers?: Array<Provider | EnvironmentProviders> },
): Promise<MountedConsumer<T>> {
  const selector = reflectComponentType(component)?.selector;
  if (!selector || selector.includes(",") || selector.includes("[")) {
    throw new Error("mountConsumer requires a component with a single element selector");
  }

  const el = document.createElement(selector);
  document.body.appendChild(el);

  const appRef = await bootstrapApplication(component, {
    providers: [provideZoneChangeDetection(), ...(options?.providers ?? [])],
  });
  const cmpRef = appRef.components[0] as ComponentRef<T>;

  return {
    el,
    instance: cmpRef.instance,
    appRef,
    destroy: () => {
      appRef.destroy();
      el.remove();
    },
    detectChanges: () => {
      cmpRef.changeDetectorRef.detectChanges();
      appRef.tick();
    },
  };
}
