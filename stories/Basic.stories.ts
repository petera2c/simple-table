import { SimpleTableVanilla } from "../dist/index.es.js";
import type { Meta, StoryObj } from "@storybook/html";

const meta: Meta = {
  title: "Vanilla/Basic",
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

export const Default: StoryObj = {
  render: () => {
    const container = document.createElement("div");
    container.style.width = "100%";
    container.style.padding = "1rem";
    container.style.boxSizing = "border-box";

    const headers = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "name", label: "Name", minWidth: 80, width: "1fr" },
      { accessor: "role", label: "Role", width: 120 },
    ];
    const rows = Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      name: `Name ${i + 1}`,
      role: i % 2 === 0 ? "Developer" : "Designer",
    }));

    const table = new SimpleTableVanilla(container, {
      defaultHeaders: headers,
      rows,
      height: "500px",
    });
    table.mount();

    return container;
  },
  parameters: {
    docs: {
      description: {
        story:
          "Minimal vanilla JS example: SimpleTableVanilla with a few columns and rows. Run `npm run build` before `npm run start`.",
      },
    },
  },
};
