import { mount } from "svelte";
import Demo from "./demos/soccer/SoccerDemo.svelte";

const el = document.getElementById("app")!;
el.style.padding = "24px";
mount(Demo, {
  target: el,
});