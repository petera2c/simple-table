import "@angular/compiler";
import "zone.js";
import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideSimpleTable } from "@simple-table/angular";
import { FooterRendererDemoComponent } from "./demos/footer-renderer/footer-renderer-demo.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [FooterRendererDemoComponent],
  template: `<div style="padding: 24px"><footer-renderer-demo height="500px"></footer-renderer-demo></div>`,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
  providers: [provideSimpleTable()],
}).catch(console.error);