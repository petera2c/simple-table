import { createApp } from "vue";
import App from "./App.vue";

const el = document.getElementById("app")!;
el.style.padding = "24px";
createApp(App).mount(el);