import "@angular/compiler";
import "zone.js";
import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideSimpleTable } from "@simple-table/angular";
import { InfrastructureDemoComponent } from "./demos/infrastructure/infrastructure-demo.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [InfrastructureDemoComponent],
  template: `<div style="padding: 24px"><infrastructure-demo height="500px"></infrastructure-demo></div>`,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
  providers: [provideSimpleTable()],
}).catch(console.error);