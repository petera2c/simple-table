import { mount } from "svelte";
import Demo from "./demos/pagination/PaginationDemo.svelte";

mount(Demo, {
  target: document.getElementById("app")!,
  props: { height: "500px" },
});