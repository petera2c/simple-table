import "@angular/compiler";
import "zone.js";
import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideSimpleTable } from "@simple-table/angular";
import { ColumnVisibilityDemoComponent } from "./demos/column-visibility/column-visibility-demo.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [ColumnVisibilityDemoComponent],
  template: `<div style="padding: 24px"><column-visibility-demo height="500px"></column-visibility-demo></div>`,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
  providers: [provideSimpleTable()],
}).catch(console.error);