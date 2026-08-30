import "@angular/compiler";
import "zone.js";
import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideSimpleTable } from "@simple-table/angular";
import { CryptoDemoComponent } from "./demos/crypto/crypto-demo.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CryptoDemoComponent],
  template: `<crypto-demo></crypto-demo>`,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
  providers: [provideSimpleTable()],
}).catch(console.error);