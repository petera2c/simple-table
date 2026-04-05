import { mount } from "svelte";
import Demo from "./demos/single-row-children/SingleRowChildrenDemo.svelte";

mount(Demo, {
  target: document.getElementById("app")!,
  props: { height: "500px" },
});