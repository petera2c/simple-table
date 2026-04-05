import { mount } from "svelte";
import Demo from "./demos/tooltip/TooltipDemo.svelte";

mount(Demo, {
  target: document.getElementById("app")!,
  props: { height: "500px" },
});