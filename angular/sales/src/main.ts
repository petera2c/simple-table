import "@angular/compiler";
import "zone.js";
import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideSimpleTable } from "@simple-table/angular";
import { SalesDemoComponent } from "./demos/sales/sales-demo.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [SalesDemoComponent],
  template: `<sales-demo height="500px"></sales-demo>`,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
  providers: [provideSimpleTable()],
}).catch(console.error);