import "@angular/compiler";
import "zone.js";
import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideSimpleTable } from "@simple-table/angular";
import { HeaderRendererDemoComponent } from "./demos/header-renderer/header-renderer-demo.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [HeaderRendererDemoComponent],
  template: `<header-renderer-demo height="500px"></header-renderer-demo>`,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
  providers: [provideSimpleTable()],
}).catch(console.error);