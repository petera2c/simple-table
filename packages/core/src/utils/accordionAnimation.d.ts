/**
 * Active axis for the in-flight accordion animation. Set on the render
 * context for one render after a collapse/expand toggle so cell renderers
 * know which dimension to fold/unfold.
 *
 *  - `"vertical"`   — row group expand/collapse: incoming cells start at
 *                     `height: 0` and CSS-transition to `rowHeight`.
 *  - `"horizontal"` — nested column expand/collapse: incoming cells start at
 *                     `width: 0` and CSS-transition to their final width.
 *  - `null`         — no accordion animation in progress (sort, reorder,
 *                     scroll, etc.).
 */
export type AccordionAxis = "vertical" | "horizontal" | null;
/** CSS class applied to the table root during the animation window. */
export declare const ACCORDION_ANIMATION_CLASS = "st-accordion-animating";
/** Custom property names consumed by the accordion CSS transitions. */
export declare const ACCORDION_DURATION_VAR = "--st-accordion-duration";
export declare const ACCORDION_EASING_VAR = "--st-accordion-easing";
/** Window after which the accordion CSS class is removed (ms past duration). */
export declare const ACCORDION_CLEANUP_BUFFER_MS = 80;
/**
 * Detect `prefers-reduced-motion: reduce`. Returns `false` outside the
 * browser (SSR) so the call site doesn't have to guard.
 */
export declare const accordionPrefersReducedMotion: () => boolean;
