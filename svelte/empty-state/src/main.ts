import { mount } from "svelte";
import Demo from "./demos/empty-state/EmptyStateDemo.svelte";

mount(Demo, {
  target: document.getElementById("app")!,
  props: { height: "500px" },
});