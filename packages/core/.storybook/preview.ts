import "../src/styles/all-themes.css";
import type { Preview } from "@storybook/html";

const preview: Preview = {
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => {
      const wrapper = document.createElement("div");
      wrapper.style.fontFamily = "Nunito, sans-serif";
      const content = Story();
      if (content instanceof HTMLElement) {
        wrapper.appendChild(content);
      } else if (typeof content === "string") {
        wrapper.innerHTML = content;
      }
      return wrapper;
    },
  ],
};

export default preview;
