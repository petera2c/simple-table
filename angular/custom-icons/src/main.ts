import "@angular/compiler";
import "zone.js";
import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideSimpleTable } from "@simple-table/angular";
import { CustomIconsDemoComponent } from "./demos/custom-icons/custom-icons-demo.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CustomIconsDemoComponent],
  template: `<custom-icons-demo height="500px"></custom-icons-demo>`,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
  providers: [provideSimpleTable()],
}).catch(console.error);