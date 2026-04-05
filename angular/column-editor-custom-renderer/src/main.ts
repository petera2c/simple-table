import "@angular/compiler";
import "zone.js";
import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideSimpleTable } from "@simple-table/angular";
import { ColumnEditorCustomRendererDemoComponent } from "./demos/column-editor-custom-renderer/column-editor-custom-renderer-demo.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [ColumnEditorCustomRendererDemoComponent],
  template: `<div style="padding: 24px"><column-editor-custom-renderer-demo height="500px"></column-editor-custom-renderer-demo></div>`,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
  providers: [provideSimpleTable()],
}).catch(console.error);