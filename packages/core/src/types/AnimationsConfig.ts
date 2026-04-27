/**
 * Configuration for cell animations on sort and programmatic column reorder.
 *
 * The animation coordinator runs FLIP-style transitions when cells move between
 * positions. All fields are optional; omit the prop entirely to use defaults.
 */
export interface AnimationsConfig {
  /** Master toggle. Defaults to `true`. When `false`, no other field has effect. */
  enabled?: boolean;
  /** Animation duration in milliseconds. Defaults to `240`. */
  duration?: number;
  /** CSS easing function. Defaults to `cubic-bezier(0.2, 0.8, 0.2, 1)`. */
  easing?: string;
}
