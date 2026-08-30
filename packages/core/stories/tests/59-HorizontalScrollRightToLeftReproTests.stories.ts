/**
 * Wide table with mixed labels and wording. Jumps to the last column, then
 * plays a recorded trackpad swipe on the body toward the first columns.
 */

import type { Meta } from "@storybook/html";
import type { ColumnDef } from "../../src/index";
import { renderVanillaTable } from "../utils";
import { getMainScrollX, setMainScrollX, waitForTable } from "./testUtils";
import { HorizontalScrollEngine } from "../../src/managers/horizontalScroll";

const IDLE_BG = "#e2e8f0";
const HIT_BG = "#dc2626";

const meta: Meta = {
  title: "Tests/59 - Horizontal Scroll Right To Left Repro",
  parameters: {
    layout: "fullscreen",
    chromatic: { disableSnapshot: true },
    test: { timeout: 30_000 },
    docs: {
      description: {
        component:
          "Simple Table on top. Below it, the same body in Simple Table's shell with custom sideways scroll, absolute rows, and the GPU paint hints turned off. Play still swipes only Simple Table.",
      },
    },
  },
};

export default meta;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Pixel wheel ticks on the body, starting at the last column. */
const RIGHT_TO_LEFT_WHEEL_TICKS: Array<{ deltaX: number; deltaY: number; waitMs: number }> = [
  { deltaX: -1, deltaY: 0, waitMs: 0 },
  { deltaX: -5, deltaY: 0, waitMs: 14 },
  { deltaX: -16, deltaY: 0, waitMs: 20 },
  { deltaX: -34, deltaY: -2, waitMs: 12 },
  { deltaX: -59, deltaY: -4, waitMs: 18 },
  { deltaX: -41, deltaY: -1, waitMs: 16 },
  { deltaX: -77, deltaY: 0, waitMs: 10 },
  { deltaX: -88, deltaY: 0, waitMs: 9 },
  { deltaX: -90, deltaY: 0, waitMs: 16 },
  { deltaX: -88, deltaY: 0, waitMs: 18 },
  { deltaX: -85, deltaY: 0, waitMs: 17 },
  { deltaX: -82, deltaY: 0, waitMs: 17 },
  { deltaX: -83, deltaY: 0, waitMs: 17 },
  { deltaX: -79, deltaY: 0, waitMs: 17 },
  { deltaX: -74, deltaY: 0, waitMs: 15 },
  { deltaX: -70, deltaY: 0, waitMs: 18 },
  { deltaX: -64, deltaY: 0, waitMs: 17 },
  { deltaX: -60, deltaY: 0, waitMs: 17 },
  { deltaX: -57, deltaY: 0, waitMs: 16 },
  { deltaX: -53, deltaY: 0, waitMs: 17 },
  { deltaX: -49, deltaY: 0, waitMs: 17 },
  { deltaX: -45, deltaY: 0, waitMs: 20 },
  { deltaX: -41, deltaY: 0, waitMs: 21 },
  { deltaX: -39, deltaY: 0, waitMs: 8 },
  { deltaX: -35, deltaY: 0, waitMs: 20 },
  { deltaX: -33, deltaY: 0, waitMs: 14 },
  { deltaX: -30, deltaY: 0, waitMs: 20 },
  { deltaX: -28, deltaY: 0, waitMs: 17 },
  { deltaX: -26, deltaY: 0, waitMs: 14 },
  { deltaX: -22, deltaY: 0, waitMs: 16 },
  { deltaX: -21, deltaY: 0, waitMs: 17 },
  { deltaX: -19, deltaY: 0, waitMs: 17 },
  { deltaX: -17, deltaY: 0, waitMs: 17 },
  { deltaX: -16, deltaY: 0, waitMs: 17 },
  { deltaX: -14, deltaY: 0, waitMs: 16 },
  { deltaX: -13, deltaY: 0, waitMs: 17 },
  { deltaX: -12, deltaY: 0, waitMs: 17 },
  { deltaX: -11, deltaY: 0, waitMs: 16 },
  { deltaX: -10, deltaY: 0, waitMs: 17 },
  { deltaX: -9, deltaY: 0, waitMs: 16 },
  { deltaX: -8, deltaY: 0, waitMs: 17 },
  { deltaX: -8, deltaY: 0, waitMs: 17 },
  { deltaX: -7, deltaY: 0, waitMs: 17 },
  { deltaX: -7, deltaY: 0, waitMs: 17 },
  { deltaX: -6, deltaY: 0, waitMs: 17 },
  { deltaX: -6, deltaY: 0, waitMs: 16 },
  { deltaX: -5, deltaY: 0, waitMs: 17 },
  { deltaX: -5, deltaY: 0, waitMs: 17 },
  { deltaX: -5, deltaY: 0, waitMs: 16 },
  { deltaX: -4, deltaY: 0, waitMs: 17 },
  { deltaX: -4, deltaY: 0, waitMs: 17 },
  { deltaX: -4, deltaY: 0, waitMs: 19 },
  { deltaX: -3, deltaY: 0, waitMs: 14 },
  { deltaX: -3, deltaY: 0, waitMs: 17 },
  { deltaX: -3, deltaY: 0, waitMs: 16 },
  { deltaX: -2, deltaY: 0, waitMs: 16 },
  { deltaX: -2, deltaY: 0, waitMs: 17 },
  { deltaX: -2, deltaY: 0, waitMs: 17 },
  { deltaX: -2, deltaY: 0, waitMs: 16 },
  { deltaX: -2, deltaY: 0, waitMs: 16 },
  { deltaX: -1, deltaY: 0, waitMs: 17 },
  { deltaX: -1, deltaY: 0, waitMs: 16 },
  { deltaX: -1, deltaY: 0, waitMs: 17 },
  { deltaX: -1, deltaY: 0, waitMs: 16 },
  { deltaX: -1, deltaY: 0, waitMs: 16 },
  { deltaX: -1, deltaY: 0, waitMs: 34 },
  { deltaX: -1, deltaY: 0, waitMs: 17 },
  { deltaX: -1, deltaY: 0, waitMs: 16 },
];

type HitchBeacon = {
  el: HTMLElement;
  reset: () => void;
  setWatching: (tick: number, total: number) => void;
  marked: (tick: number, ms: number) => void;
};

type SwipeProbe = {
  runId: number;
  running: boolean;
  swipeStartedAt: number;
  tick: number;
  x: number;
  lastDeltaX: number;
  lastWaitMs: number;
};

const pick = (row: number, col: number, list: string[]): string =>
  list[(row * 19 + col * 11) % list.length];

const NAMES = [
  "Mina Okonkwo",
  "Diego Vargas",
  "Priya Natarajan",
  "Jonah Hale",
  "Saskia Berg",
  "Rafael Costa",
  "Leila Haddad",
  "Owen Brice",
  "Yuki Tanaka",
  "Marisol Peña",
];
const CITIES = [
  "Lisbon",
  "Osaka",
  "Medellín",
  "Reykjavík",
  "Cape Town",
  "Tallinn",
  "Queretaro",
  "Hobart",
  "Bergen",
  "Chiang Mai",
];
const ROLES = [
  "Set designer",
  "Field botanist",
  "Radio producer",
  "Pastry lead",
  "Harbor pilot",
  "Archivist",
  "Climbing guide",
  "Type founder",
  "Night librarian",
  "Glassblower",
];
const PROJECTS = [
  "Amber tide atlas",
  "Kettle drum school",
  "Paper kite census",
  "Old mill kitchen",
  "North quay lights",
  "Fern catalog",
  "Silent film club",
  "River ferry map",
  "Copper roof repair",
  "Dawn market stall",
];
const NOTES = [
  "Bring the linen samples, not the wool.",
  "She left a sketch under the espresso machine.",
  "Hold until the tide chart is posted.",
  "The green crate is the one with spare reeds.",
  "Call after the matinee, never before.",
  "Door code changed; use the side garden.",
  "Skip the freeway; take the ridge road.",
  "The cat answers to mustard, not her name.",
];
const STATUSES = [
  "On the water",
  "Drafting",
  "Paused for rain",
  "In rehearsal",
  "Packed",
  "Waiting on parts",
  "Opened late",
  "Almost done",
];
const SEEN = [
  "Tuesday dusk",
  "Just after bells",
  "Last thaw",
  "Before the ferry",
  "Mid-harvest",
  "During intermission",
  "Sunday market",
  "First frost",
];
const OWNERS = [
  "Nia",
  "Bo",
  "Emre",
  "Clare",
  "Soren",
  "Ines",
  "Pavel",
  "June",
];
const CHANNELS = [
  "Harbor radio",
  "Paper note",
  "Studio intercom",
  "Kitchen chalkboard",
  "Climbing call",
  "Night desk",
  "Ferry loudspeaker",
  "Market stall",
];
const COUNTRIES = [
  "Portugal",
  "Japan",
  "Colombia",
  "Iceland",
  "South Africa",
  "Estonia",
  "Mexico",
  "Australia",
];
const ZONES = [
  "Atlantic/Canary",
  "Asia/Tokyo",
  "America/Bogota",
  "Atlantic/Reykjavik",
  "Africa/Johannesburg",
  "Europe/Tallinn",
  "America/Mexico_City",
  "Australia/Hobart",
];
const DEVICES = [
  "Film camera",
  "Field recorder",
  "Clay tablet",
  "Folding bike",
  "Sail compass",
  "Letterpress",
  "Tea kettle",
  "Sketch roll",
];
const PLANS = [
  "Guest week",
  "Season pass",
  "One sitting",
  "Open studio",
  "Night shift",
  "Dock lease",
  "Reading room",
  "Trail day",
];
const TAGS = [
  "brine",
  "cedar",
  "saffron",
  "indigo",
  "pollen",
  "ember",
  "linen",
  "basalt",
];
const QUOTES = [
  "Leave the window for the moths.",
  "We measure in footsteps, not miles.",
  "The soup is ready when it sighs.",
  "Tune down a half step in rain.",
  "Nobody counts the extra chair.",
  "Ink first, then the good paper.",
];
const NEXT = [
  "Oil the gate",
  "Label the jars",
  "Walk the south fence",
  "Retie the fly gallery",
  "Proof the menu",
  "Map the side trail",
  "Rinse the brushes",
  "Post the tide",
];
const HABITS = [
  "Early swim",
  "Second espresso",
  "Reads on trains",
  "Whistles off-key",
  "Collects buttons",
  "Sleeps at noon",
  "Writes in pencil",
  "Feeds stray dogs",
];
const COLORS = [
  "oxblood",
  "chartreuse",
  "fog",
  "marigold",
  "slate",
  "persimmon",
  "sea glass",
  "umber",
];
const FOODS = [
  "grilled peaches",
  "barley stew",
  "salted licorice",
  "sourdough heels",
  "green almond",
  "smoked trout",
  "cardamom bun",
  "pickled plum",
];
const BOOKS = [
  "The Lighthouse Cookbook",
  "Maps Without Roads",
  "A Short History of Bells",
  "Ferns of the Attic",
  "Who Closed the Harbor",
  "Notes From a Warm Oven",
];
const AIRPORTS = [
  "LIS",
  "KIX",
  "MDE",
  "KEF",
  "CPT",
  "TLL",
  "QRO",
  "HBA",
];
const WEATHER = [
  "low fog, no wind",
  "hard sun, dry stone",
  "warm rain at three",
  "clear and biting",
  "cloud stacked like wool",
  "a long still noon",
  "gusts off the bay",
  "light that makes dust show",
];

type MixedRow = Record<string, string>;

const COLUMN_SPECS: Array<{ accessor: string; label: string; width: number; words: string[] }> = [
  { accessor: "name", label: "Person", width: 160, words: NAMES },
  { accessor: "city", label: "City", width: 130, words: CITIES },
  { accessor: "role", label: "Work", width: 150, words: ROLES },
  { accessor: "project", label: "Project", width: 180, words: PROJECTS },
  { accessor: "note", label: "Note", width: 280, words: NOTES },
  { accessor: "status", label: "Status", width: 150, words: STATUSES },
  { accessor: "lastSeen", label: "Last seen", width: 150, words: SEEN },
  { accessor: "owner", label: "Owner", width: 100, words: OWNERS },
  { accessor: "channel", label: "Heard via", width: 170, words: CHANNELS },
  { accessor: "country", label: "Country", width: 140, words: COUNTRIES },
  { accessor: "zone", label: "Clock", width: 190, words: ZONES },
  { accessor: "device", label: "Kit", width: 140, words: DEVICES },
  { accessor: "plan", label: "Pass", width: 130, words: PLANS },
  { accessor: "tag", label: "Scent", width: 110, words: TAGS },
  { accessor: "quote", label: "Said", width: 260, words: QUOTES },
  { accessor: "next", label: "Next", width: 170, words: NEXT },
  { accessor: "habit", label: "Habit", width: 150, words: HABITS },
  { accessor: "color", label: "Color", width: 120, words: COLORS },
  { accessor: "food", label: "Food", width: 150, words: FOODS },
  { accessor: "book", label: "Book", width: 210, words: BOOKS },
  { accessor: "airport", label: "Gate", width: 90, words: AIRPORTS },
  { accessor: "weather", label: "Sky", width: 200, words: WEATHER },
];

const mixedHeaders = (): ColumnDef<MixedRow>[] =>
  COLUMN_SPECS.map((col, index) => ({
    accessor: col.accessor,
    label: col.label,
    width: col.width,
    type: "string" as const,
    pinned: index === 0 ? "left" : undefined,
  }));

const mixedRows = (): MixedRow[] =>
  Array.from({ length: 80 }, (_, row) => {
    const record: MixedRow = { id: `r${row + 1}` };
    COLUMN_SPECS.forEach((col, colIndex) => {
      record[col.accessor] = pick(row, colIndex, col.words);
    });
    return record;
  });

const renderMixedTable = (): HTMLElement => {
  const { wrapper, h2 } = renderVanillaTable(mixedHeaders(), mixedRows(), {
    columnResizing: true,
    height: "70dvh",
    getRowId: ({ row }) => String((row as MixedRow).id),
  });
  h2.textContent = "Simple Table";
  return wrapper;
};

const ROW_HEIGHT = 32;

const el = (tag: string, className?: string): HTMLElement => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
};

const appendInFlowCell = (
  row: HTMLElement,
  text: string,
  width: number,
  odd: boolean,
): void => {
  const cell = el("div", `st-cell left-aligned ${odd ? "st-cell-odd-row" : "st-cell-even-row"}`);
  cell.style.position = "relative";
  cell.style.flex = `0 0 ${width}px`;
  cell.style.width = `${width}px`;
  cell.style.height = "100%";
  const content = el("span", "st-cell-content left-aligned");
  content.textContent = text;
  cell.appendChild(content);
  row.appendChild(cell);
};

const appendAbsRow = (
  host: HTMLElement,
  top: number,
  width: number,
  odd: boolean,
): HTMLElement => {
  const row = el("div", `st-row ${odd ? "odd" : "even"}`);
  row.style.position = "absolute";
  row.style.left = "0";
  row.style.top = `${top}px`;
  row.style.width = `${width}px`;
  row.style.height = `${ROW_HEIGHT}px`;
  row.style.display = "flex";
  host.appendChild(row);
  return row;
};

const appendScrollLayer = (pane: HTMLElement, width: number, height: number): HTMLElement => {
  const layer = el("div", "st-h-scroll-layer");
  layer.style.width = `${width}px`;
  layer.style.height = `${height}px`;
  pane.appendChild(layer);
  return layer;
};

const appendRowSeparators = (host: HTMLElement, rowCount: number, sectionWidth: number): void => {
  for (let i = 1; i <= rowCount; i++) {
    const separator = el("div", "st-row-separator");
    separator.style.left = "0";
    separator.style.width = `${sectionWidth}px`;
    separator.style.transform = `translate3d(0, ${i * ROW_HEIGHT}px, 0)`;
    host.appendChild(separator);
  }
};

/**
 * Same shell as Simple Table body: pinned column, main pane, scroll layers,
 * and absolute rows with in-flow cells. Custom sideways scroll on the main
 * pane. No header.
 */
const renderNativeHtmlTable = (): HTMLElement => {
  const wrap = document.createElement("div");
  wrap.style.padding = "0 2rem 2rem";

  const heading = document.createElement("h2");
  heading.textContent = "Hardcoded Simple Table shell";
  heading.style.margin = "2rem 0 1rem";
  heading.style.fontFamily = "sans-serif";

  const style = document.createElement("style");
  style.textContent = `
    [data-abs-clone] {
      height: 70dvh;
    }
    [data-abs-clone] .st-cell {
      position: relative;
      height: 100%;
    }
    [data-abs-clone] .st-h-scroll-layer {
      will-change: auto;
    }
    [data-abs-clone] .st-row {
      backface-visibility: visible;
    }
  `;

  const pinCol = COLUMN_SPECS[0];
  const mainCols = COLUMN_SPECS.slice(1);
  const pinWidth = pinCol.width;
  const mainWidth = mainCols.reduce((sum, col) => sum + col.width, 0);
  const rows = mixedRows();
  const bodyHeight = rows.length * ROW_HEIGHT;

  const root = el("div", "simple-table-root st-wrapper theme-modern-light");
  root.dataset.absClone = "true";

  const wrapperContainer = el("div", "st-wrapper-container");
  const contentWrapper = el("div", "st-content-wrapper");
  const content = el("div", "st-content");
  const bodyContainer = el("div", "st-body-container");

  const bodyPin = el("div", "st-body-pinned-left");
  bodyPin.style.position = "relative";
  bodyPin.style.width = `${pinWidth}px`;
  bodyPin.style.height = `${bodyHeight}px`;
  const bodyPinLayer = appendScrollLayer(bodyPin, pinWidth, bodyHeight);

  const bodyMain = el("div", "st-body-main");
  bodyMain.style.position = "relative";
  bodyMain.style.flexGrow = "1";
  bodyMain.style.height = `${bodyHeight}px`;
  const bodyMainLayer = appendScrollLayer(bodyMain, mainWidth, bodyHeight);

  rows.forEach((row, rowIndex) => {
    const top = rowIndex * ROW_HEIGHT;
    const odd = rowIndex % 2 === 1;
    const pinRow = appendAbsRow(bodyPinLayer, top, pinWidth, odd);
    appendInFlowCell(pinRow, row[pinCol.accessor] ?? "", pinWidth, odd);
    const mainRow = appendAbsRow(bodyMainLayer, top, mainWidth, odd);
    mainCols.forEach((col) => {
      appendInFlowCell(mainRow, row[col.accessor] ?? "", col.width, odd);
    });
  });
  appendRowSeparators(bodyPinLayer, rows.length, pinWidth);
  appendRowSeparators(bodyMainLayer, rows.length, mainWidth);

  bodyContainer.append(bodyPin, bodyMain);
  content.append(bodyContainer);
  contentWrapper.appendChild(content);
  wrapperContainer.appendChild(contentWrapper);
  root.appendChild(wrapperContainer);

  const engine = new HorizontalScrollEngine();
  engine.bindRoot(root);
  engine.registerPane("main", bodyMain, "body");
  const updateMetrics = () => {
    engine.setSectionMetrics("main", {
      contentWidth: mainWidth,
      viewportWidth: bodyMain.clientWidth,
    });
  };
  updateMetrics();
  const resizeObserver = new ResizeObserver(updateMetrics);
  resizeObserver.observe(bodyMain);

  wrap.append(heading, style, root);
  return wrap;
};

const createBeacon = (): HitchBeacon => {
  const el = document.createElement("div");
  el.style.height = "48px";
  el.style.width = "100%";
  el.style.display = "flex";
  el.style.alignItems = "center";
  el.style.justifyContent = "center";
  el.style.fontFamily = "sans-serif";
  el.style.fontSize = "14px";
  el.style.fontWeight = "600";
  el.style.color = "#334155";
  el.style.background = IDLE_BG;
  el.textContent = "Idle";

  const paintIdle = (text: string) => {
    el.style.background = IDLE_BG;
    el.style.color = "#334155";
    el.textContent = text;
  };

  return {
    el,
    reset: () => paintIdle("Idle"),
    setWatching: (tick, total) => paintIdle(`Watching  ${tick} / ${total}`),
    marked: (tick, ms) => {
      el.style.background = HIT_BG;
      el.style.color = "#fff";
      el.textContent = `You marked tick ${tick}  (${Math.round(ms)}ms in)`;
    },
  };
};

let runCounter = 0;

const fireRecordedSwipe = async (
  body: HTMLElement,
  root: HTMLElement,
  beacon: HitchBeacon,
  probe: SwipeProbe,
  evenTiming: boolean,
): Promise<void> => {
  const total = RIGHT_TO_LEFT_WHEEL_TICKS.length;
  for (let i = 0; i < total; i++) {
    const tick = RIGHT_TO_LEFT_WHEEL_TICKS[i];
    const waitMs = evenTiming && i > 0 ? 16 : tick.waitMs;
    probe.tick = i + 1;
    probe.lastDeltaX = tick.deltaX;
    probe.lastWaitMs = waitMs;
    beacon.setWatching(i + 1, total);
    if (waitMs > 0) await wait(waitMs);
    body.dispatchEvent(
      new WheelEvent("wheel", {
        deltaX: tick.deltaX,
        deltaY: tick.deltaY,
        deltaMode: 0,
        cancelable: true,
        bubbles: true,
      }),
    );
    probe.x = getMainScrollX(root);
  }
};

const runSwipe = async (
  root: HTMLElement,
  beacon: HitchBeacon,
  probe: SwipeProbe,
  evenTiming: boolean,
): Promise<void> => {
  const body = root.querySelector(".st-body-main");
  if (!(body instanceof HTMLElement)) return;
  beacon.reset();
  setMainScrollX(root, 1_000_000);
  await wait(300);

  runCounter += 1;
  probe.runId = runCounter;
  probe.running = true;
  probe.swipeStartedAt = performance.now();
  probe.tick = 0;
  probe.x = getMainScrollX(root);
  probe.lastDeltaX = 0;
  probe.lastWaitMs = 0;

  try {
    await fireRecordedSwipe(body, root, beacon, probe, evenTiming);
  } finally {
    probe.running = false;
    probe.x = getMainScrollX(root);
  }
};

const renderRepro = (): HTMLElement => {
  const page = document.createElement("div");
  page.dataset.hscrollReproPage = "true";
  const beacon = createBeacon();
  const probe: SwipeProbe = {
    runId: 0,
    running: false,
    swipeStartedAt: 0,
    tick: 0,
    x: 0,
    lastDeltaX: 0,
    lastWaitMs: 0,
  };
  (page as HTMLElement & { _beacon?: HitchBeacon; _probe?: SwipeProbe })._beacon = beacon;
  (page as HTMLElement & { _beacon?: HitchBeacon; _probe?: SwipeProbe })._probe = probe;

  const buttons = document.createElement("div");
  buttons.style.display = "grid";
  buttons.style.margin = "1rem 2rem 0";
  buttons.style.width = "fit-content";

  const buttonStyle = (el: HTMLButtonElement) => {
    el.style.gridArea = "1 / 1";
    el.style.padding = "12px 20px";
    el.style.fontSize = "16px";
    el.style.fontWeight = "700";
    el.style.cursor = "pointer";
    el.style.minWidth = "140px";
  };

  const play = document.createElement("button");
  play.type = "button";
  play.textContent = "Play";
  buttonStyle(play);

  const mark = document.createElement("button");
  mark.type = "button";
  mark.textContent = "Mark lag";
  buttonStyle(mark);
  mark.style.visibility = "hidden";

  const showPlay = () => {
    play.style.visibility = "visible";
    mark.style.visibility = "hidden";
  };
  const showMark = () => {
    play.style.visibility = "hidden";
    mark.style.visibility = "visible";
  };

  let running = false;
  play.addEventListener("click", async () => {
    if (running) return;
    running = true;
    showMark();
    try {
      await runSwipe(page, beacon, probe, even.checked);
    } finally {
      running = false;
      showPlay();
    }
  });

  mark.addEventListener("click", () => {
    const ms = probe.swipeStartedAt ? performance.now() - probe.swipeStartedAt : -1;
    beacon.marked(probe.tick, ms);
  });

  const evenLabel = document.createElement("label");
  evenLabel.style.display = "flex";
  evenLabel.style.alignItems = "center";
  evenLabel.style.gap = "8px";
  evenLabel.style.margin = "0.75rem 2rem 0";
  evenLabel.style.fontFamily = "sans-serif";
  evenLabel.style.fontSize = "14px";
  const even = document.createElement("input");
  even.type = "checkbox";
  evenLabel.append(even, document.createTextNode("Even timing (16ms between ticks)"));

  buttons.append(play, mark);
  page.append(beacon.el, buttons, evenLabel, renderMixedTable(), renderNativeHtmlTable());
  return page;
};

export const BillingRightToLeftSwipe = {
  parameters: { tags: ["horizontal-scroll-right-to-left-repro"] },
  render: () => renderRepro(),
  play: async () => {
    await waitForTable();
  },
};
