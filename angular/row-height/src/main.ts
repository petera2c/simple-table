import "@angular/compiler";
import "zone.js";
import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideSimpleTable } from "@simple-table/angular";
import { RowHeightDemoComponent } from "./demos/row-height/row-height-demo.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RowHeightDemoComponent],
  template: `<div style="padding: 24px"><row-height-demo height="500px"></row-height-demo></div>`,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
  providers: [provideSimpleTable()],
}).catch(console.error);