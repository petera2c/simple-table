import { createEffect, onCleanup, onMount } from "solid-js";
import { SimpleTableVanilla } from "simple-table-core";
import type { TableAPI } from "simple-table-core";
import { buildVanillaConfig } from "./buildVanillaConfig";
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
 *   defaultHeaders={headers}
 * />
 */
export function SimpleTable(props: SimpleTableSolidProps) {
  let containerEl!: HTMLDivElement;
  let instance: TableInstance | null = null;

  onMount(() => {
    instance = new SimpleTableVanilla(
      containerEl,
      buildVanillaConfig(props)
    ) as unknown as TableInstance;
    instance.mount();

    if (props.ref) {
      props.ref(instance.getAPI() as TableAPI);
    }
  });

  // Sync prop changes reactively. Solid tracks signal reads inside createEffect
  // so this re-runs whenever any reactive prop changes.
  createEffect(() => {
    if (instance) {
      instance.update(buildVanillaConfig(props));
    }
  });

  onCleanup(() => {
    instance?.destroy();
    instance = null;
  });

  return <div ref={containerEl} />;
}
