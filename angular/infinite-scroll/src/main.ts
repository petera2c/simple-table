import "@angular/compiler";
import "zone.js";
import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideSimpleTable } from "@simple-table/angular";
import { InfiniteScrollDemoComponent } from "./demos/infinite-scroll/infinite-scroll-demo.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [InfiniteScrollDemoComponent],
  template: `<infinite-scroll-demo height="500px"></infinite-scroll-demo>`,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
  providers: [provideSimpleTable()],
}).catch(console.error);