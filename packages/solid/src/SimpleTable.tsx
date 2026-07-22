import { createEffect, onCleanup, onMount } from "solid-js";
import {
  SimpleTableVanilla,
  headersStructurallyEqual,
  rowsShallowUnchanged,
} from "simple-table-core";
import type { SimpleTableConfig, TableAPI } from "simple-table-core";
import { buildVanillaConfig, resolveSolidColumns } from "./buildVanillaConfig";
import { MountRegistry } from "./MountRegistry";
import type { SimpleTableSolidProps, TableInstance } from "./types";

/**
 * SimpleTable — Solid.js adapter for simple-table-core.
 *
 * Accepts the same props as SimpleTableProps (the vanilla user-facing API) but
 * with Solid component types for all renderer props.
 *
 * Pass a callback `ref` prop to receive the full TableAPI imperative interface:
 *
 * @example
 * let tableApi: TableAPI | undefined;
 *
 * <SimpleTable
 *   ref={(api) => (tableApi = api)}
 *   rows={rows()}
 *   columns={headers}
 * />
 */
export function SimpleTable(props: SimpleTableSolidProps) {
  let containerEl!: HTMLDivElement;
  let instance: TableInstance | null = null;
  const registry = new MountRegistry();
  let syncedDefaultHeaders: ReadonlyArray<
    NonNullable<SimpleTableSolidProps["columns"]>[number]
  > | undefined;
  let syncedRows: SimpleTableSolidProps["rows"] | undefined;

  onMount(() => {
    instance = new SimpleTableVanilla(
      containerEl,
      buildVanillaConfig(props, registry),
    ) as unknown as TableInstance;
    instance.mount();
    syncedDefaultHeaders = resolveSolidColumns(props);
    syncedRows = props.rows;

    if (props.ref) {
      props.ref(instance.getAPI() as TableAPI);
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
      props.getRowId,
    );
    syncedRows = props.rows;
    if (rowsUnchanged) {
      delete patch.rows;
    }

    instance.update(patch);
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
