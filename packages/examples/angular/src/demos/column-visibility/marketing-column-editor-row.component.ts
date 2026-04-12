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

/** Marketing-style column-editor row; slots are framework-provided nodes or strings. */
@Component({
  selector: "st-examples-marketing-column-editor-row",
  standalone: true,
  template: `
    <div
      style="width:100%;display:flex;align-items:center;justify-content:space-between;gap:8px;padding-right:8px;"
    >
      <div style="display:flex;align-items:center;gap:8px;">
        <span #expandHost></span>
        <span #checkboxHost></span>
        <span #labelHost></span>
      </div>
      <span #dragHost></span>
    </div>
  `,
})
export class MarketingColumnEditorRowComponent implements AfterViewInit, OnChanges {
  @Input({ required: true }) accessor!: ColumnEditorRowRendererProps["accessor"];
  @Input({ required: true }) header!: ColumnEditorRowRendererProps["header"];
  @Input({ required: true }) components!: ColumnEditorRowRendererProps["components"];
  @Input() panelSection?: ColumnEditorRowRendererProps["panelSection"];
  @Input() isEssential?: ColumnEditorRowRendererProps["isEssential"];
  @Input() canToggleVisibility?: ColumnEditorRowRendererProps["canToggleVisibility"];
  @Input() allowColumnPinning?: ColumnEditorRowRendererProps["allowColumnPinning"];
  @Input() pinControl?: ColumnEditorRowRendererProps["pinControl"];

  @ViewChild("expandHost") expandRef?: ElementRef<HTMLSpanElement>;
  @ViewChild("checkboxHost") checkboxRef?: ElementRef<HTMLSpanElement>;
  @ViewChild("labelHost") labelRef?: ElementRef<HTMLSpanElement>;
  @ViewChild("dragHost") dragRef?: ElementRef<HTMLSpanElement>;

  ngAfterViewInit(): void {
    this.syncSlots();
  }

  ngOnChanges(): void {
    this.syncSlots();
  }

  private syncSlots(): void {
    const c = this.components;
    attach(c.expandIcon, this.expandRef?.nativeElement);
    attach(c.checkbox, this.checkboxRef?.nativeElement);
    attach(c.labelContent, this.labelRef?.nativeElement);
    attach(c.dragIcon, this.dragRef?.nativeElement);
  }
}
