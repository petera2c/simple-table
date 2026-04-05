import { mount } from "svelte";
import Demo from "./demos/external-sort/ExternalSortDemo.svelte";

mount(Demo, {
  target: document.getElementById("app")!,
  props: { height: "500px" },
});