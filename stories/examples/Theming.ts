/**
 * Theming Example – vanilla port of React Theming.
 */
import { renderVanillaTable } from "../utils";
import { defaultVanillaArgs, type UniversalVanillaArgs } from "../vanillaStoryConfig";
import { generateSpaceData } from "../data/space-data";
import { SPACE_HEADERS } from "../data/space-data";

export const themingExampleDefaults = {
  columnResizing: true,
  columnReordering: true,
  editColumns: true,
  selectableCells: true,
  selectableColumns: true,
  shouldPaginate: true,
  rowsPerPage: 10,
  height: "400px",
};

const THEME_OPTIONS = [
  "sky",
  "violet",
  "neutral",
  "light",
  "dark",
  "modern-light",
  "modern-dark",
] as const;

export function renderThemingExample(args?: Partial<UniversalVanillaArgs>): HTMLElement {
  const data = generateSpaceData();
  const options = { ...defaultVanillaArgs, ...themingExampleDefaults, ...args };
  const { wrapper, table } = renderVanillaTable(SPACE_HEADERS, data, {
    ...options,
    getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
  });
  const title = wrapper.querySelector("h2");
  if (title) title.textContent = "Theming";
  const btnContainer = document.createElement("div");
  btnContainer.style.display = "flex";
  btnContainer.style.flexWrap = "wrap";
  btnContainer.style.gap = "0.5rem";
  btnContainer.style.padding = "1rem";
  btnContainer.style.marginTop = "1rem";
  THEME_OPTIONS.forEach((themeOption) => {
    const btn = document.createElement("button");
    btn.textContent = themeOption;
    btn.type = "button";
    btn.style.cssText =
      "border:none;border-radius:4px;padding:0.25rem 0.5rem;cursor:pointer;font-family:Nunito,sans-serif;white-space:nowrap;";
    btn.addEventListener("click", () => {
      table.update({ theme: themeOption });
      btnContainer.querySelectorAll("button").forEach((b) => {
        (b as HTMLButtonElement).style.backgroundColor = "#f0f0f0";
        (b as HTMLButtonElement).style.color = "black";
      });
      btn.style.backgroundColor = "#007acc";
      btn.style.color = "white";
    });
    if (themeOption === "light") {
      btn.style.backgroundColor = "#007acc";
      btn.style.color = "white";
    } else {
      btn.style.backgroundColor = "#f0f0f0";
      btn.style.color = "black";
    }
    btnContainer.appendChild(btn);
  });
  wrapper.appendChild(btnContainer);
  return wrapper;
}
