import { mount } from "svelte";
import Demo from "./demos/aggregate-functions/AggregateFunctionsDemo.svelte";

mount(Demo, {
  target: document.getElementById("app")!,
  props: { height: "500px" },
});