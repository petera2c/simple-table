import { mount } from "svelte";
import Demo from "./demos/quick-filter/QuickFilterDemo.svelte";

const el = document.getElementById("app")!;
el.style.padding = "24px";
mount(Demo, {
  target: el,
  props: { height: "500px" },
});