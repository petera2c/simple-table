import "@angular/compiler";
import "zone.js";
import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideSimpleTable } from "@simple-table/angular";
import { ValueFormatterDemoComponent } from "./demos/value-formatter/value-formatter-demo.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [ValueFormatterDemoComponent],
  template: `<value-formatter-demo></value-formatter-demo>`,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
  providers: [provideSimpleTable()],
}).catch(console.error);