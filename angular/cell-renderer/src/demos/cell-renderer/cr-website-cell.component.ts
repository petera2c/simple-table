import { Component, Input } from "@angular/core";
import type { CellValue } from "@simple-table/angular";

@Component({
  standalone: true,
  selector: "demo-cr-website",
  template: `
    <span>🌐 <a class="crw" [href]="'https://' + url" target="_blank" rel="noopener noreferrer">{{ url }}</a></span>
  `,
  styles: [
    `
      .crw {
        color: #2563eb;
        text-decoration: none;
      }
      .crw:hover {
        text-decoration: underline;
      }
    `,
  ],
})
export class CrWebsiteCellComponent {
  @Input() value!: CellValue;

  get url(): string {
    return String(this.value);
  }
}
