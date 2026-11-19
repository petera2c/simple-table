import "@angular/compiler";
import "zone.js";
import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideSimpleTable } from "@simple-table/angular";
import { SingleRowChildrenDemoComponent } from "./demos/single-row-children/single-row-children-demo.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [SingleRowChildrenDemoComponent],
  template: `<single-row-children-demo></single-row-children-demo>`,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
  providers: [provideSimpleTable()],
}).catch(console.error);