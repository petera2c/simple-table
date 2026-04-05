import HeaderObject, { Accessor } from "../types/HeaderObject";
import { PinnedSectionsState } from "../types/PinnedSectionsState";
import { PanelSection } from "../types/PanelSection";

export type { PinnedSectionsState, PanelSection };

/** Root-level columns only, preserving order within each pin group. */
export function partitionRootHeadersByPin(headers: HeaderObject[]): {
  pinnedLeft: HeaderObject[];
  unpinned: HeaderObject[];
  pinnedRight: HeaderObject[];
} {
  return {
    pinnedLeft: headers.filter((h) => h.pinned === "left"),
    unpinned: headers.filter((h) => !h.pinned),
    pinnedRight: headers.filter((h) => h.pinned === "right"),
  };
}

export function isHeaderEssential(
  header: HeaderObject,
  essentialAccessors: ReadonlySet<string>,
): boolean {
  return (
    header.isEssential === true ||
    essentialAccessors.has(String(header.accessor))
  );
}

/** Accessors for every header with `isEssential` in the tree (including nested). */
export function collectEssentialAccessors(headers: HeaderObject[]): Set<string> {
  const set = new Set<string>();
  const walk = (list: HeaderObject[]) => {
    for (const h of list) {
      if (h.isEssential) set.add(String(h.accessor));
      if (h.children?.length) walk(h.children);
    }
  };
  walk(headers);
  return set;
}

/** Within one sibling list: all essential columns must form a left prefix. */
export function hasEssentialPrefixOrder(
  siblings: HeaderObject[],
  essentialAccessors: ReadonlySet<string>,
): boolean {
  let sawNonEssential = false;
  for (const h of siblings) {
    if (h.isSelectionColumn || h.excludeFromRender) continue;
    const ess = isHeaderEssential(h, essentialAccessors);
    if (ess && sawNonEssential) return false;
    if (!ess) sawNonEssential = true;
  }
  return true;
}

/** Root array mixes pin sections; validate each pin group separately, then recurse into children. */
export function validateFullHeaderTreeEssentialOrder(
  headers: HeaderObject[],
  essentialAccessors: ReadonlySet<string>,
): boolean {
  const { pinnedLeft, unpinned, pinnedRight } = partitionRootHeadersByPin(headers);
  if (!hasEssentialPrefixOrder(pinnedLeft, essentialAccessors)) return false;
  if (!hasEssentialPrefixOrder(unpinned, essentialAccessors)) return false;
  if (!hasEssentialPrefixOrder(pinnedRight, essentialAccessors)) return false;
  for (const h of headers) {
    if (h.children?.length) {
      if (!validateEssentialPrefixRecursive(h.children, essentialAccessors)) return false;
    }
  }
  return true;
}

function validateEssentialPrefixRecursive(
  children: HeaderObject[],
  essentialAccessors: ReadonlySet<string>,
): boolean {
  if (!hasEssentialPrefixOrder(children, essentialAccessors)) return false;
  for (const h of children) {
    if (h.children?.length && !validateEssentialPrefixRecursive(h.children, essentialAccessors)) {
      return false;
    }
  }
  return true;
}

export function getPinnedSectionsState(headers: HeaderObject[]): PinnedSectionsState {
  const { pinnedLeft, unpinned, pinnedRight } = partitionRootHeadersByPin(headers);
  return {
    left: pinnedLeft.map((h) => h.accessor),
    main: unpinned.map((h) => h.accessor),
    right: pinnedRight.map((h) => h.accessor),
  };
}

function clampSectionAccessors(
  accessors: Accessor[],
  headerByAccessor: Map<string, HeaderObject>,
  essentialAccessors: ReadonlySet<string>,
): Accessor[] {
  const essential = accessors.filter((a) =>
    isHeaderEssential(headerByAccessor.get(String(a))!, essentialAccessors),
  );
  const nonEssential = accessors.filter(
    (a) => !isHeaderEssential(headerByAccessor.get(String(a))!, essentialAccessors),
  );
  return [...essential, ...nonEssential];
}

/**
 * Rebuilds root `headers` order and `pinned` flags from section accessor lists.
 * Clamps essential columns to the left within each section. Returns null if accessors don't match roots.
 */
export function rebuildHeadersFromPinnedState(
  headers: HeaderObject[],
  state: PinnedSectionsState,
  essentialAccessors: ReadonlySet<string>,
): HeaderObject[] | null {
  const rootKeys = new Set(headers.map((h) => String(h.accessor)));
  const listed = [...state.left, ...state.main, ...state.right];
  if (listed.length !== rootKeys.size) return null;
  for (const a of listed) {
    if (!rootKeys.has(String(a))) return null;
  }
  const headerByAccessor = new Map(headers.map((h) => [String(h.accessor), h]));

  const left = clampSectionAccessors(state.left, headerByAccessor, essentialAccessors);
  const main = clampSectionAccessors(state.main, headerByAccessor, essentialAccessors);
  const right = clampSectionAccessors(state.right, headerByAccessor, essentialAccessors);

  const withPin = (h: HeaderObject, pin: "left" | "right" | undefined): HeaderObject => {
    const next: HeaderObject = { ...h };
    if (pin === "left") next.pinned = "left";
    else if (pin === "right") next.pinned = "right";
    else delete next.pinned;
    return next;
  };

  return [
    ...left.map((a) => withPin(headerByAccessor.get(String(a))!, "left")),
    ...main.map((a) => withPin(headerByAccessor.get(String(a))!, undefined)),
    ...right.map((a) => withPin(headerByAccessor.get(String(a))!, "right")),
  ];
}

/**
 * Move a root column to another pin section.
 * Appends within left/right targets. For `main`, left-pinned columns are inserted at the
 * start of main; right-pinned (and other) columns are inserted at the end of main.
 */
export function moveRootColumnPinSide(
  headers: HeaderObject[],
  accessor: Accessor,
  target: Exclude<PanelSection, "main"> | "main",
  essentialAccessors: ReadonlySet<string>,
): HeaderObject[] | null {
  const acc = String(accessor);
  const current = getPinnedSectionsState(headers);
  const left = current.left.filter((a) => String(a) !== acc);
  const main = current.main.filter((a) => String(a) !== acc);
  const right = current.right.filter((a) => String(a) !== acc);

  const header = headers.find((h) => String(h.accessor) === acc);
  if (!header) return null;

  if (isHeaderEssential(header, essentialAccessors)) {
    if (target === "main" && (header.pinned === "left" || header.pinned === "right")) {
      return null;
    }
  }

  if (target === "left") left.push(accessor);
  else if (target === "right") right.push(accessor);
  else if (header.pinned === "left") main.unshift(accessor);
  else main.push(accessor);

  return rebuildHeadersFromPinnedState(
    headers,
    { left, main, right },
    essentialAccessors,
  );
}
