import HeaderObject, { Accessor } from "../types/HeaderObject";
import { PinnedSectionsState } from "../types/PinnedSectionsState";
import { PanelSection } from "../types/PanelSection";
export type { PinnedSectionsState, PanelSection };
/** Root-level columns only, preserving order within each pin group. */
export declare function partitionRootHeadersByPin(headers: HeaderObject[]): {
    pinnedLeft: HeaderObject[];
    unpinned: HeaderObject[];
    pinnedRight: HeaderObject[];
};
export declare function isHeaderEssential(header: HeaderObject, essentialAccessors: ReadonlySet<string>): boolean;
/** Accessors for every header with `isEssential` in the tree (including nested). */
export declare function collectEssentialAccessors(headers: HeaderObject[]): Set<string>;
/** Within one sibling list: all essential columns must form a left prefix. */
export declare function hasEssentialPrefixOrder(siblings: HeaderObject[], essentialAccessors: ReadonlySet<string>): boolean;
/** Root array mixes pin sections; validate each pin group separately, then recurse into children. */
export declare function validateFullHeaderTreeEssentialOrder(headers: HeaderObject[], essentialAccessors: ReadonlySet<string>): boolean;
export declare function getPinnedSectionsState(headers: HeaderObject[]): PinnedSectionsState;
/**
 * Rebuilds root `headers` order and `pinned` flags from section accessor lists.
 * Clamps essential columns to the left within each section. Returns null if accessors don't match roots.
 */
export declare function rebuildHeadersFromPinnedState(headers: HeaderObject[], state: PinnedSectionsState, essentialAccessors: ReadonlySet<string>): HeaderObject[] | null;
/**
 * Move a root column to another pin section.
 * Appends within left/right targets. For `main`, left-pinned columns are inserted at the
 * start of main; right-pinned (and other) columns are inserted at the end of main.
 */
export declare function moveRootColumnPinSide(headers: HeaderObject[], accessor: Accessor, target: Exclude<PanelSection, "main"> | "main", essentialAccessors: ReadonlySet<string>): HeaderObject[] | null;
