import { Component, computed, Input, signal } from "@angular/core";
import type { HeaderRendererProps } from "@simple-table/angular";
import { cycleHeaderDemoSort, headerDemoSortAccessor, headerDemoSortDirection } from "./header-demo-sort";

@Component({
  standalone: true,
  selector: "demo-header-sortable",
  template: `
    <div
      style="cursor:pointer;user-select:none;font-weight:600;display:flex;align-items:center;gap:4px;"
      (click)="onClick()"
      (keydown)="onKeydown($event)"
      role="button"
      tabindex="0"
    >
      <span>{{ header.label }}</span>
      @if (indicator()) {
        <span style="font-size:10px;color:#6366f1;">{{ indicator() }}</span>
      }
    </div>
  `,
})
export class HeaderSortableHeaderComponent {
  private readonly accessorStr = signal("");

  @Input({ required: true }) set header(h: HeaderRendererProps["header"]) {
    this._header = h;
    this.accessorStr.set(String(h.accessor));
  }
  get header(): HeaderRendererProps["header"] {
    return this._header;
  }
  private _header!: HeaderRendererProps["header"];

  @Input() accessor?: HeaderRendererProps["accessor"];
  @Input() colIndex?: HeaderRendererProps["colIndex"];
  @Input() components?: HeaderRendererProps["components"];

  readonly indicator = computed(() => {
    headerDemoSortAccessor();
    headerDemoSortDirection();
    const acc = this.accessorStr();
    const isSorted = headerDemoSortAccessor() === acc;
    const dir = isSorted ? headerDemoSortDirection() : null;
    return dir === "asc" ? " ▲" : dir === "desc" ? " ▼" : "";
  });

  onClick(): void {
    cycleHeaderDemoSort(this.accessorStr());
  }

  onKeydown(e: KeyboardEvent): void {
    if (e.key === "Enter") this.onClick();
  }
}
