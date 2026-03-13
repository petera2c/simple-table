/**
 * QuickFilter Example – vanilla port of React QuickFilterExample.
 */
import type { HeaderObject } from "../../src/index";
import { renderVanillaTable, addParagraph } from "../utils";
import { defaultVanillaArgs, type UniversalVanillaArgs } from "../vanillaStoryConfig";
import { createBasicData } from "./BasicExample";

const HEADERS: HeaderObject[] = [
  { accessor: "id", label: "ID", width: 80 },
  { accessor: "name", label: "Name", width: 150 },
  { accessor: "age", label: "Age", width: 100 },
  { accessor: "role", label: "Role", width: 150 },
];

export const quickFilterExampleDefaults = { height: "400px" };

export function renderQuickFilterExample(args?: Partial<UniversalVanillaArgs>): HTMLElement {
  const options = { ...defaultVanillaArgs, ...quickFilterExampleDefaults, ...args };
  let quickFilterText = "";
  const { wrapper, h2, tableContainer, table } = renderVanillaTable(HEADERS, createBasicData(40), {
    ...options,
    getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
    quickFilter: { text: quickFilterText },
  });

  h2.textContent = "Quick Filter / Global Search";
  addParagraph(
    wrapper,
    "Search across all columns with a single input. Supports both simple and smart search modes.",
    tableContainer
  );

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Search across all columns...";
  input.style.marginBottom = "0.75rem";
  input.style.padding = "0.5rem";
  input.style.width = "280px";
  input.style.display = "block";
  wrapper.insertBefore(input, tableContainer);

  const applyQuickFilter = (text: string) => {
    quickFilterText = text;
    input.value = text;
    table.update({ quickFilter: { text } });
  };

  input.addEventListener("input", () => applyQuickFilter(input.value));

  const tryLabels = [
    "engineering",
    "alice engineering",
    '"alice johnson"',
    "-inactive",
    "department:engineering",
    "engineering -inactive location:new",
  ];
  const strong = document.createElement("strong");
  strong.textContent = "Try these examples: ";
  strong.style.display = "block";
  strong.style.marginBottom = "0.5rem";
  wrapper.insertBefore(strong, tableContainer);
  const btnRow = document.createElement("div");
  btnRow.style.display = "flex";
  btnRow.style.gap = "0.5rem";
  btnRow.style.flexWrap = "wrap";
  btnRow.style.marginBottom = "1rem";
  for (const label of tryLabels) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = label;
    btn.style.padding = "6px 12px";
    btn.style.fontSize = "12px";
    btn.style.cursor = "pointer";
    btn.addEventListener("click", () => applyQuickFilter(label));
    btnRow.appendChild(btn);
  }
  wrapper.insertBefore(btnRow, tableContainer);

  return wrapper;
}
