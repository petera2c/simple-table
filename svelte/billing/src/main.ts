import { mount } from "svelte";
import Demo from "./demos/billing/BillingDemo.svelte";

const el = document.getElementById("app")!;
el.style.padding = "24px";
mount(Demo, {
  target: el,
});