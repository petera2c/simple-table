import "@angular/compiler";
import "zone.js";
import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideSimpleTable } from "@simple-table/angular";
import { AnimationsDemoComponent } from "./demos/animations/animations-demo.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [AnimationsDemoComponent],
  template: `<animations-demo></animations-demo>`,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
  providers: [provideSimpleTable()],
}).catch(console.error);