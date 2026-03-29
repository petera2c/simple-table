import type { EnvironmentProviders } from "@angular/core";
import { makeEnvironmentProviders } from "@angular/core";

/**
 * Call this in your application's `providers` array (or `bootstrapApplication`
 * providers) to register the dependencies that simple-table-angular's renderer
 * bridge needs — specifically `ApplicationRef` and `EnvironmentInjector`.
 *
 * These are already provided by Angular's platform by default, so in practice
 * this function is a no-op placeholder that serves as a clear signal to
 * consumers that the adapter has been correctly wired up. If future versions
 * need custom providers they will be added here without breaking the call site.
 *
 * @example
 * // main.ts
 * bootstrapApplication(AppComponent, {
 *   providers: [provideSimpleTable()],
 * });
 *
 * @example
 * // app.module.ts
 * @NgModule({ providers: [provideSimpleTable()] })
 * export class AppModule {}
 */
export function provideSimpleTable(): EnvironmentProviders {
  return makeEnvironmentProviders([
    // ApplicationRef and EnvironmentInjector are part of Angular's core platform
    // and are available without any additional registration.
    // This factory is intentionally empty — it exists for API symmetry with
    // other Angular ecosystem libraries and to allow non-breaking additions later.
  ]);
}
