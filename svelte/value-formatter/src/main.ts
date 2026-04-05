import { mount } from "svelte";
import Demo from "./demos/value-formatter/ValueFormatterDemo.svelte";

mount(Demo, {
  target: document.getElementById("app")!,
  props: { height: "500px" },
});