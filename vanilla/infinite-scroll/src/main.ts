import { renderInfiniteScrollDemo } from "./demos/infinite-scroll/InfiniteScrollDemo";

const container = document.getElementById("root")!;
const instance = renderInfiniteScrollDemo(container, {});
if (instance?.mount) instance.mount();