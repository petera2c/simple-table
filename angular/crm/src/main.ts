import "@angular/compiler";
import "zone.js";
import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideSimpleTable } from "@simple-table/angular";
import { CRMDemoComponent } from "./demos/crm/crm-demo.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CRMDemoComponent],
  template: `<crm-demo height="500px"></crm-demo>`,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
  providers: [provideSimpleTable()],
}).catch(console.error);