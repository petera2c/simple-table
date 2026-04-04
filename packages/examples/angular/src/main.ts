import "@angular/compiler";
import "zone.js";
import "./styles/shell.css";

import { bootstrapApplication } from "@angular/platform-browser";
import { AppComponent } from "./app.component";
import { provideSimpleTable } from "@simple-table/angular";

bootstrapApplication(AppComponent, {
  providers: [provideSimpleTable()],
}).catch(console.error);
