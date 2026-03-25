import { defineComponent, onMounted, onUnmounted, onUpdated, ref, h, camelize } from "vue";
import { SimpleTableVanilla } from "simple-table-core";
import type { TableAPI } from "simple-table-core";
import { buildVanillaConfig } from "./buildVanillaConfig";
import type { SimpleTableVueProps, TableInstance } from "./types";

/**
 * SimpleTable — Vue 3 adapter for simple-table-core.
 *
 * Accepts the same props as SimpleTableProps (the vanilla user-facing API) but
 * with Vue component types for all renderer props.
 *
 * Use Vue's template ref to access the full TableAPI imperative interface:
 *
 * @example
 * <template>
 *   <SimpleTable ref="tableRef" :rows="rows" :default-headers="headers" />
 * </template>
 *
 * <script setup lang="ts">
 * import { ref } from 'vue'
 * import type { TableAPI } from 'simple-table-vue'
 * const tableRef = ref<TableAPI | null>(null)
 * // tableRef.value?.sort(...)
 * </script>
 */
/**
 * Vue preserves the original casing of attrs for undeclared props.
 * Template authors use kebab-case (:default-headers, :should-paginate),
 * which the compiler outputs as "default-headers" etc. in the VNode props.
 * Since our props option is empty, these land in attrs with hyphens.
 * We camelize here so buildVanillaConfig receives the expected camelCase keys.
 */
function camelizeAttrs(attrs: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const key in attrs) out[camelize(key)] = attrs[key];
  return out;
}

const SimpleTable = defineComponent({
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

    onMounted(() => {
      if (!containerRef.value) return;

      instance = new SimpleTableVanilla(
        containerRef.value,
        buildVanillaConfig(camelizeAttrs(attrs) as unknown as SimpleTableVueProps)
      ) as unknown as TableInstance;
      instance.mount();
    });

    onUpdated(() => {
      instance?.update(buildVanillaConfig(camelizeAttrs(attrs) as unknown as SimpleTableVueProps));
    });

    onUnmounted(() => {
      instance?.destroy();
      instance = null;
    });

    // Expose TableAPI methods via template ref so consumers can call
    // tableRef.value.sort(...), tableRef.value.filter(...), etc.
    expose({
      getAPI: (): TableAPI | null => instance?.getAPI() ?? null,
    });

    return () => h("div", { ref: containerRef });
  },
});

export default SimpleTable;
