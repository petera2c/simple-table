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
  template: `<div style="padding: 24px"><value-formatter-demo height="500px"></value-formatter-demo></div>`,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
  providers: [provideSimpleTable()],
}).catch(console.error);