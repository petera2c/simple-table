import type { EnvironmentProviders } from "@angular/core";
import { makeEnvironmentProviders } from "@angular/core";

/**
 * Optional. Angular already provides `ApplicationRef` and `EnvironmentInjector`.
 * The table does not require this in `bootstrapApplication` / `providers`.
 *
 * Kept so existing apps that call it keep compiling. Future versions may add
 * real providers here without changing the call site.
 *
 * @example
 * bootstrapApplication(AppComponent, {
 *   providers: [provideSimpleTable()],
 * });
 */
export function provideSimpleTable(): EnvironmentProviders {
  return makeEnvironmentProviders([]);
}
