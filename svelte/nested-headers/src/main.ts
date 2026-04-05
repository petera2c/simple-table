import { mount } from "svelte";
import Demo from "./demos/nested-headers/NestedHeadersDemo.svelte";

mount(Demo, {
  target: document.getElementById("app")!,
  props: { height: "500px" },
});