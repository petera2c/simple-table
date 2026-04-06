import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  ViewChild,
} from "@angular/core";
import type { ColumnEditorRowRendererProps } from "@simple-table/angular";

function appendMarketingColumnEditorSlot(parent: HTMLElement, slot: string | Node | undefined): void {
  if (slot == null) return;
  if (typeof slot === "string") {
    parent.appendChild(document.createTextNode(slot));
  } else {
    parent.appendChild(slot);
  }
}

/** Angular examples-only copy of the marketing column-editor row layout. */
function buildMarketingStyleColumnEditorRow(rootProps: ColumnEditorRowRendererProps): HTMLElement {
  const { components } = rootProps;
  const outer = document.createElement("div");
  outer.style.width = "100%";
  outer.style.display = "flex";
  outer.style.alignItems = "center";
  outer.style.justifyContent = "space-between";
  outer.style.gap = "8px";
  outer.style.paddingRight = "8px";

  const left = document.createElement("div");
  left.style.display = "flex";
  left.style.alignItems = "center";
  left.style.gap = "8px";
  appendMarketingColumnEditorSlot(left, components.expandIcon as Node | string | undefined);
  appendMarketingColumnEditorSlot(left, components.checkbox as Node | string | undefined);
  appendMarketingColumnEditorSlot(left, components.labelContent as Node | string | undefined);
  outer.appendChild(left);

  const right = document.createElement("div");
  appendMarketingColumnEditorSlot(right, components.dragIcon as Node | string | undefined);
  outer.appendChild(right);

  return outer;
}

@Component({
  selector: "st-examples-marketing-column-editor-row",
  standalone: true,
  template: `<div #anchor style="display: contents"></div>`,
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

  @ViewChild("anchor", { static: false }) anchorRef?: ElementRef<HTMLDivElement>;

  ngAfterViewInit(): void {
    this.syncRow();
  }

  ngOnChanges(): void {
    this.syncRow();
  }

  private syncRow(): void {
    const host = this.anchorRef?.nativeElement;
    if (!host) return;
    const row = buildMarketingStyleColumnEditorRow({
      accessor: this.accessor,
      header: this.header,
      components: this.components,
      panelSection: this.panelSection,
      isEssential: this.isEssential,
      canToggleVisibility: this.canToggleVisibility,
      allowColumnPinning: this.allowColumnPinning,
      pinControl: this.pinControl,
    });
    host.replaceChildren(row);
  }
}
