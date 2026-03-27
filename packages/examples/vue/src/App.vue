<script setup lang="ts">
import { ref, shallowRef, defineAsyncComponent, onMounted, onUnmounted } from "vue";
import { DEMO_LIST } from "@simple-table/examples-shared";

const registry: Record<string, () => Promise<{ default: any }>> = {
  "quick-start": () => import("./demos/quick-start/QuickStartDemo.vue"),
  "column-filtering": () => import("./demos/column-filtering/ColumnFilteringDemo.vue"),
  "column-sorting": () => import("./demos/column-sorting/ColumnSortingDemo.vue"),
  "value-formatter": () => import("./demos/value-formatter/ValueFormatterDemo.vue"),
  "pagination": () => import("./demos/pagination/PaginationDemo.vue"),
};

const params = new URLSearchParams(window.location.search);
const height = params.get("height") || undefined;
const theme = params.get("theme") || undefined;

const activeDemo = ref(params.get("demo") || "quick-start");
const DemoComponent = shallowRef<ReturnType<typeof defineAsyncComponent> | null>(null);

function loadDemo(id: string) {
  const loader = registry[id];
  DemoComponent.value = loader ? defineAsyncComponent(loader) : null;
}

function selectDemo(id: string) {
  activeDemo.value = id;
  const url = new URL(window.location.href);
  url.searchParams.set("demo", id);
  window.history.pushState({}, "", url);
  loadDemo(id);
}

function handlePopState() {
  activeDemo.value =
    new URLSearchParams(window.location.search).get("demo") || "quick-start";
  loadDemo(activeDemo.value);
}

loadDemo(activeDemo.value);

onMounted(() => window.addEventListener("popstate", handlePopState));
onUnmounted(() => window.removeEventListener("popstate", handlePopState));
</script>

<template>
  <div class="examples-shell">
    <aside class="examples-sidebar">
      <div class="examples-sidebar-header">Vue Examples</div>
      <nav>
        <ul class="examples-sidebar-nav">
          <li v-for="demo in DEMO_LIST" :key="demo.id">
            <button
              class="examples-sidebar-link"
              :class="{ active: activeDemo === demo.id }"
              @click="selectDemo(demo.id)"
            >
              {{ demo.label }}
            </button>
          </li>
        </ul>
      </nav>
    </aside>
    <main class="examples-content">
      <component
        v-if="DemoComponent"
        :is="DemoComponent"
        :height="height"
        :theme="theme"
      />
      <h2 v-else>Unknown demo: {{ activeDemo }}</h2>
    </main>
  </div>
</template>
