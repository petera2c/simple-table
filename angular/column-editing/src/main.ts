import "@angular/compiler";
import "zone.js";
import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideSimpleTable } from "@simple-table/angular";
import { ColumnEditingDemoComponent } from "./demos/column-editing/column-editing-demo.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [ColumnEditingDemoComponent],
  template: `<div style="padding: 24px"><column-editing-demo height="500px"></column-editing-demo></div>`,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
  providers: [provideSimpleTable()],
}).catch(console.error);