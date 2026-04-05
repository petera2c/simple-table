import { mount } from "svelte";
import Demo from "./demos/dynamic-nested-tables/DynamicNestedTablesDemo.svelte";

mount(Demo, {
  target: document.getElementById("app")!,
  props: { height: "500px" },
});