import { renderInfiniteScrollDemo } from "./demos/infinite-scroll/InfiniteScrollDemo";

const container = document.getElementById("root")!;
const instance = renderInfiniteScrollDemo(container, { height: "500px" });
if (instance?.mount) instance.mount();