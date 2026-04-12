import "@angular/compiler";
import "zone.js";
import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideSimpleTable } from "@simple-table/angular";
import { CsvExportDemoComponent } from "./demos/csv-export/csv-export-demo.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CsvExportDemoComponent],
  template: `<csv-export-demo height="500px"></csv-export-demo>`,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
  providers: [provideSimpleTable()],
}).catch(console.error);