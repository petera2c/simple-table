import { defineComponent, onMounted, onUnmounted, watch, ref, h, camelize } from "vue";
import type { DefineComponent } from "vue";
import {
  SimpleTableVanilla,
  headersStructurallyEqual,
  rowsShallowUnchanged,
} from "simple-table-core";
import type { SimpleTableConfig, TableAPI } from "simple-table-core";
import { buildVanillaConfig, resolveVueColumns } from "./buildVanillaConfig";
import { MountRegistry } from "./MountRegistry";
import type {
  SimpleTableExposed,
  SimpleTableVueProps,
  TableInstance,
  VueDefaultRowData,
} from "./types";

/**
 * SimpleTable — Vue 3 adapter for simple-table-core.
 *
 * Accepts the same props as SimpleTableProps (the vanilla user-facing API) but
 * with Vue component types for all renderer props.
 *
 * `TData` is typed on `SimpleTableVueProps` / `VueColumnDef`; prefer typed
 * `rows` / `columns` in script. Template attrs inference may be weaker than
 * React/Solid JSX.
 *
 * Use Vue's template ref to access the full TableAPI imperative interface:
 *
 * @example
 * <template>
 *   <SimpleTable ref="tableRef" :rows="rows" :columns="headers" :get-row-id="getRowId" />
 * </template>
 *
 * <script setup lang="ts">
 * import { ref } from 'vue'
 * import type { SimpleTableExposed } from '@simple-table/vue'
 * const tableRef = ref<SimpleTableExposed<HREmployee> | null>(null)
 * </script>
 */
/**
 * Vue preserves the original casing of attrs for undeclared props.
 * Template authors use kebab-case (:columns, :enable-pagination),
 * which the compiler outputs as "columns" etc. in the VNode props.
 * Since our props option is empty, these land in attrs with hyphens.
 * We camelize here so buildVanillaConfig receives the expected camelCase keys.
 */
function camelizeAttrs(attrs: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const key in attrs) {
    out[camelize(key)] = attrs[key] === "" ? true : attrs[key];
  }
  return out;
}

/** Top-level referential equality; mirrors React's shallowTablePropsChanged. */
function shallowTablePropsChanged(
  prev: SimpleTableVueProps,
  next: SimpleTableVueProps,
): boolean {
  const keys = new Set([
    ...Object.keys(prev as object),
    ...Object.keys(next as object),
  ]) as Set<keyof SimpleTableVueProps>;
  for (const key of keys) {
    if (prev[key] !== next[key]) return true;
  }
  return false;
}

const SimpleTableInner = defineComponent({
  name: "SimpleTable",

  props: {
    // All SimpleTableVueProps are passed through. Vue requires props to be
    // declared; we declare a catch-all via inheritAttrs: false and pass
    // $attrs to buildVanillaConfig so consumers can use any prop.
  },

  inheritAttrs: false,

  setup(_props, { attrs, expose }) {
    const containerRef = ref<HTMLDivElement | null>(null);
    let instance: TableInstance | null = null;
    const registry = new MountRegistry();
    let syncedDefaultHeaders: ReadonlyArray<
      NonNullable<SimpleTableVueProps["columns"]>[number]
    > | undefined;
    let syncedRows: SimpleTableVueProps["rows"] | undefined;
    let lastSyncedProps: SimpleTableVueProps | null = null;
    let wasLoading = false;
    let didInitialAutoSize = false;

    function maybeRefitAutoSizeColumns(leftLoading: boolean) {
      if (!instance) return;
      if (leftLoading) {
        instance.refitAutoSizeColumns?.();
        return;
      }
      // Vue mounts are synchronous, so custom renderer DOM is already present
      // after the first paint that registered mounts (mirrors React's
      // first-portals refit).
      if (!didInitialAutoSize && registry.size > 0) {
        didInitialAutoSize = true;
        instance.refitAutoSizeColumns?.();
      }
    }

    function syncFromAttrs() {
      if (!instance) return;
      const props = camelizeAttrs(attrs) as unknown as SimpleTableVueProps;

      // Same guard as React: skip when parent re-rendered with identical
      // top-level bindings (new attrs object, same values).
      if (lastSyncedProps !== null && !shallowTablePropsChanged(lastSyncedProps, props)) {
        return;
      }
      lastSyncedProps = props;

      const fullConfig = buildVanillaConfig(props, registry);
      const patch: Partial<SimpleTableConfig> = { ...fullConfig };
      const resolvedColumns = resolveVueColumns(props);

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
    }

    onMounted(() => {
      if (!containerRef.value) return;

      const props = camelizeAttrs(attrs) as unknown as SimpleTableVueProps;
      instance = new SimpleTableVanilla(
        containerRef.value,
        buildVanillaConfig(props, registry),
      ) as unknown as TableInstance;
      instance.mount();
      // Seed sync refs so the first attrs watch run is a no-op (React does the
      // same after mount-once).
      lastSyncedProps = props;
      syncedDefaultHeaders = resolveVueColumns(props);
      syncedRows = props.rows;
      wasLoading = Boolean(props.isLoading);
      maybeRefitAutoSizeColumns(false);
    });

    // setup() attrs is a Proxy over a plain object — NOT a reactive watch
    // source — so `watch(attrs, …)` never fires (issue #128). Spreading in a
    // getter tracks attrs' "" key; Vue triggers that key whenever fallthrough
    // attrs change.
    watch(() => ({ ...attrs }), syncFromAttrs);

    onUnmounted(() => {
      instance?.destroy();
      instance = null;
      syncedDefaultHeaders = undefined;
      syncedRows = undefined;
      lastSyncedProps = null;
      registry.clear();
    });

    // Expose TableAPI via template ref. Type the ref as
    // `SimpleTableExposed<TData>` for a typed `getAPI()` return.
    expose({
      getAPI: (): TableAPI | null => instance?.getAPI() ?? null,
    } satisfies SimpleTableExposed);

    return () => h("div", { ref: containerRef });
  },
});

// No default on `TData`: TypeScript should infer it from `rows` / `columns`
// for `h(SimpleTable, { … })` callers. (`SimpleTableVueProps` still defaults
// for untyped prop bags / helpers.)
type SimpleTableComponent = <TData extends VueDefaultRowData>(
  props: SimpleTableVueProps<TData>,
) => ReturnType<typeof h>;

const SimpleTable = SimpleTableInner as unknown as SimpleTableComponent &
  DefineComponent & {
    name?: string;
  };

export default SimpleTable;
