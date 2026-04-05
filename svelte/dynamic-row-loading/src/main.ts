import { mount } from "svelte";
import Demo from "./demos/dynamic-row-loading/DynamicRowLoadingDemo.svelte";

mount(Demo, {
  target: document.getElementById("app")!,
  props: { height: "500px" },
});