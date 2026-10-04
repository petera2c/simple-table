import { mount } from "svelte";
import Demo from "./demos/dynamic-row-loading/DynamicRowLoadingDemo.svelte";

const el = document.getElementById("app")!;
el.style.padding = "24px";
mount(Demo, {
  target: el,
});