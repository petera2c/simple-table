import { mount } from "svelte";
import Demo from "./demos/collapsible-columns/CollapsibleColumnsDemo.svelte";

mount(Demo, {
  target: document.getElementById("app")!,
  props: { height: "500px" },
});