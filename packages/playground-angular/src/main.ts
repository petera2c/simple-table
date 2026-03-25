// Load the Angular JIT compiler before anything else.
// This enables runtime compilation of @Component decorators and templates,
// letting us run Angular without the Angular CLI or any build plugin.
import "@angular/compiler";
import "zone.js";

import { bootstrapApplication } from "@angular/platform-browser";
import { AppComponent } from "./app.component";
import { provideSimpleTable } from "simple-table-angular";

bootstrapApplication(AppComponent, {
  providers: [provideSimpleTable()],
}).catch(console.error);
