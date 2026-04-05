import { mount } from "svelte";
import Demo from "./demos/custom-icons/CustomIconsDemo.svelte";

mount(Demo, {
  target: document.getElementById("app")!,
  props: { height: "500px" },
});