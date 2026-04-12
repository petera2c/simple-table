import "@angular/compiler";
import "zone.js";
import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideSimpleTable } from "@simple-table/angular";
import { ThemesDemoComponent } from "./demos/themes/themes-demo.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [ThemesDemoComponent],
  template: `<themes-demo height="500px"></themes-demo>`,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
  providers: [provideSimpleTable()],
}).catch(console.error);