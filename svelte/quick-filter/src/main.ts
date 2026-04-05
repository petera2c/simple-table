import { mount } from "svelte";
import Demo from "./demos/quick-filter/QuickFilterDemo.svelte";

mount(Demo, {
  target: document.getElementById("app")!,
  props: { height: "500px" },
});