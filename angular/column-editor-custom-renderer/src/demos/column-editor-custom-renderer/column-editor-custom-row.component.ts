import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  ViewChild,
} from "@angular/core";
import type { ColumnEditorRowRendererProps } from "@simple-table/angular";

function attach(slot: unknown, host: HTMLElement | undefined): void {
  if (!host) return;
  host.replaceChildren();
  if (slot == null) return;
  if (typeof slot === "string") {
    host.textContent = slot;
  } else if (slot instanceof Node) {
    host.appendChild(slot);
  }
}

@Component({
  standalone: true,
  selector: "demo-column-editor-custom-row",
  template: `
    <div
      style="display:flex;align-items:center;gap:8px;padding:6px 8px;border-radius:6px;background:#f8fafc;margin-bottom:4px;"
    >
      @if (components.checkbox) {
        <span #checkboxHost></span>
      }
      <span style="flex:1;font-size:13px;font-weight:500;">{{ header.label }}</span>
      @if (components.dragIcon) {
        <span #dragHost style="cursor:grab;opacity:0.5;"></span>
      }
    </div>
  `,
})
export class ColumnEditorCustomRowComponent implements AfterViewInit, OnChanges {
  @Input({ required: true }) header!: ColumnEditorRowRendererProps["header"];
  @Input({ required: true }) components!: ColumnEditorRowRendererProps["components"];
  @Input() accessor?: ColumnEditorRowRendererProps["accessor"];
  @Input() panelSection?: ColumnEditorRowRendererProps["panelSection"];
  @Input() isEssential?: ColumnEditorRowRendererProps["isEssential"];
  @Input() canToggleVisibility?: ColumnEditorRowRendererProps["canToggleVisibility"];
  @Input() allowColumnPinning?: ColumnEditorRowRendererProps["allowColumnPinning"];
  @Input() pinControl?: ColumnEditorRowRendererProps["pinControl"];

  @ViewChild("checkboxHost") checkboxRef?: ElementRef<HTMLSpanElement>;
  @ViewChild("dragHost") dragRef?: ElementRef<HTMLSpanElement>;

  ngAfterViewInit(): void {
    this.syncSlots();
  }

  ngOnChanges(): void {
    this.syncSlots();
  }

  private syncSlots(): void {
    attach(this.components.checkbox, this.checkboxRef?.nativeElement);
    attach(this.components.dragIcon, this.dragRef?.nativeElement);
  }
}
