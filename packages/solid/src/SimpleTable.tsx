import { createEffect, onCleanup, onMount } from "solid-js";
import {
  SimpleTableVanilla,
  headersStructurallyEqual,
  rowsShallowUnchanged,
} from "simple-table-core";
import type { SimpleTableConfig, TableAPI } from "simple-table-core";
import { buildVanillaConfig, resolveSolidColumns } from "./buildVanillaConfig";
import { MountRegistry } from "./MountRegistry";
import type {
  SimpleTableSolidProps,
  SolidDefaultRowData,
  TableInstance,
} from "./types";

/**
 * SimpleTable — Solid.js adapter for simple-table-core.
 *
 * Accepts the same props as SimpleTableProps (the vanilla user-facing API) but
 * with Solid component types for all renderer props.
 *
 * `TData` is inferred from `rows` / `columns` — no explicit type argument needed
 * for typical demos. Pass a callback `ref` prop to receive the TableAPI once mounted:
 *
 * @example
 * let tableApi: TableAPI<HREmployee> | undefined;
 *
 * <SimpleTable
 *   ref={(api) => (tableApi = api)}
 *   rows={rows()}
 *   columns={headers}
 *   getRowId={({ row }) => row.id}
 * />
 */
// No default on `TData`: TypeScript should infer it from `rows` / `columns`
// so callers can write `<SimpleTable rows={facts} …>` without `<FactRow>`.
// (`SimpleTableSolidProps` still defaults for untyped prop bags / helpers.)
export function SimpleTable<TData extends SolidDefaultRowData>(
  props: SimpleTableSolidProps<TData>,
) {
  let containerEl!: HTMLDivElement;
  let instance: TableInstance | null = null;
  const registry = new MountRegistry();
  let syncedDefaultHeaders: ReadonlyArray<
    NonNullable<SimpleTableSolidProps<TData>["columns"]>[number]
  > | undefined;
  let syncedRows: SimpleTableSolidProps<TData>["rows"] | undefined;
  let wasLoading = false;
  let didInitialAutoSize = false;

  function maybeRefitAutoSizeColumns(leftLoading: boolean) {
    if (!instance) return;
    if (leftLoading) {
      instance.refitAutoSizeColumns?.();
      return;
    }
    // Solid mounts are synchronous, so custom renderer DOM is already present
    // after the first paint that registered mounts (mirrors Vue/React).
    if (!didInitialAutoSize && registry.size > 0) {
      didInitialAutoSize = true;
      instance.refitAutoSizeColumns?.();
    }
  }

  onMount(() => {
    instance = new SimpleTableVanilla(
      containerEl,
      buildVanillaConfig(props, registry),
    ) as unknown as TableInstance;
    instance.mount();
    syncedDefaultHeaders = resolveSolidColumns(props);
    syncedRows = props.rows;
    wasLoading = Boolean(props.isLoading);
    maybeRefitAutoSizeColumns(false);

    if (props.ref) {
      // Runtime API is Row-shaped; expose as TableAPI<TData> at the boundary.
      props.ref(instance.getAPI() as unknown as TableAPI<TData>);
    }
  });

  // Sync prop changes reactively. Skip no-op columns/rows when
  // structure/content is unchanged (unstable column/row rebuilds).
  createEffect(() => {
    if (!instance) return;

    const fullConfig = buildVanillaConfig(props, registry);
    const patch: Partial<SimpleTableConfig> = { ...fullConfig };
    const resolvedColumns = resolveSolidColumns(props);

    const headersUnchanged = headersStructurallyEqual(
      syncedDefaultHeaders,
      resolvedColumns,
    );
    syncedDefaultHeaders = resolvedColumns;
    if (headersUnchanged) {
      delete patch.columns;
    }

    const rowsUnchanged = rowsShallowUnchanged(
      syncedRows as ReadonlyArray<object> | undefined,
      props.rows as ReadonlyArray<object>,
      props.getRowId as Parameters<typeof rowsShallowUnchanged>[2],
    );
    syncedRows = props.rows;
    if (rowsUnchanged) {
      delete patch.rows;
    }

    const isLoading = Boolean(props.isLoading);
    const leftLoading = wasLoading && !isLoading;
    wasLoading = isLoading;

    instance.update(patch);
    maybeRefitAutoSizeColumns(leftLoading);
  });

  onCleanup(() => {
    instance?.destroy();
    instance = null;
    syncedDefaultHeaders = undefined;
    syncedRows = undefined;
    registry.clear();
  });

  return <div ref={containerEl} />;
}
