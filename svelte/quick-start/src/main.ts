import { mount } from "svelte";
import Demo from "./demos/quick-start/QuickStartDemo.svelte";

mount(Demo, {
  target: document.getElementById("app")!,
  props: { height: "500px" },
});