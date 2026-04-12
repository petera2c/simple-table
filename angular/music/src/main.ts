import "@angular/compiler";
import "zone.js";
import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideSimpleTable } from "@simple-table/angular";
import { MusicDemoComponent } from "./demos/music/music-demo.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [MusicDemoComponent],
  template: `<music-demo height="500px"></music-demo>`,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
  providers: [provideSimpleTable()],
}).catch(console.error);