/**
 * Test-only `$state` props bag for imperative `mount()` of SimpleTable so
 * later mutations drive the adapter's reactive `$:` sync without remounting.
 */
export function createReactiveProps<T extends Record<string, any>>(initial: T): T {
  let props = $state(initial);
  return props;
}
