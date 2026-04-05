import { renderInfiniteScrollDemo } from "./demos/infinite-scroll/InfiniteScrollDemo";

const container = document.getElementById("root")!;
container.style.padding = "24px";
renderInfiniteScrollDemo(container, { height: "500px" });