import { NgModule } from "@angular/core";
import { SimpleTableComponent } from "./SimpleTableComponent";
import {
  StCellDirective,
  StDomSlotDirective,
  StEmptyDirective,
  StErrorDirective,
  StFooterDirective,
  StHeaderDirective,
  StLoadingDirective,
} from "./stDirectives";

const ST_STANDALONE = [
  SimpleTableComponent,
  StCellDirective,
  StHeaderDirective,
  StEmptyDirective,
  StFooterDirective,
  StLoadingDirective,
  StErrorDirective,
  StDomSlotDirective,
] as const;

/**
 * One import for a page that uses `<simple-table>` plus `stCell` / `stEmpty` /
 * `(sortChange)` and the other template directives.
 *
 * ```ts
 * @Component({
 *   standalone: true,
 *   imports: [SimpleTableImports],
 * })
 * ```
 */
@NgModule({
  imports: [...ST_STANDALONE],
  exports: [...ST_STANDALONE],
})
export class SimpleTableImports {}
