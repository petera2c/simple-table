import { Component, computed, Input } from "@angular/core";
import type { FooterRendererProps } from "@simple-table/angular";
import type { Theme } from "@simple-table/angular";
import { footerDemoThemeContext } from "./footer-demo-theme-context";

function palette(theme?: Theme) {
  switch (theme) {
    case "modern-dark":
    case "dark":
      return {
        background: "#1f2937",
        border: "#374151",
        text: "#d1d5db",
        buttonBg: "#374151",
        buttonBorder: "#4b5563",
        buttonActive: "#3b82f6",
        buttonText: "#d1d5db",
        buttonDisabled: "#6b7280",
      };
    case "light":
    case "modern-light":
      return {
        background: "white",
        border: "#f3f4f6",
        text: "#6b7280",
        buttonBg: "white",
        buttonBorder: "#e5e7eb",
        buttonActive: "#3b82f6",
        buttonText: "#374151",
        buttonDisabled: "#d1d5db",
      };
    default:
      return {
        background: "#f8fafc",
        border: "#e2e8f0",
        text: "#475569",
        buttonBg: "white",
        buttonBorder: "#e2e8f0",
        buttonActive: "#3b82f6",
        buttonText: "#64748b",
        buttonDisabled: "#cbd5e1",
      };
  }
}

@Component({
  standalone: true,
  selector: "demo-footer-pagination",
  template: `
    <div
      style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px;"
      [style.background-color]="colors().background"
      [style.border-top]="'2px solid ' + colors().border"
    >
      <span style="font-size:14px;font-weight:600;" [style.color]="colors().text">
        Showing {{ startRow }}–{{ endRow }} of {{ totalRows }} items
      </span>
      <div style="display:flex;align-items:center;gap:8px;">
        <button
          type="button"
          [disabled]="!hasPrevPage"
          (click)="onPrevPage()"
          [style.padding]="'8px 16px'"
          [style.font-size]="'14px'"
          [style.font-weight]="'500'"
          [style.color]="btnStylePrev().color"
          [style.background-color]="btnStylePrev().bg"
          [style.border]="'1px solid ' + colors().buttonBorder"
          [style.border-radius]="'6px'"
          [style.cursor]="hasPrevPage ? 'pointer' : 'not-allowed'"
          [style.min-width]="'40px'"
        >
          Previous
        </button>
        <div style="display:flex;gap:4px;">
          @for (p of pageNumbers(); track p) {
            <button
              type="button"
              (click)="onPageChange(p)"
              [style.padding]="'8px 12px'"
              [style.font-size]="'14px'"
              [style.font-weight]="'500'"
              [style.color]="pageBtnStyle(p).color"
              [style.background-color]="pageBtnStyle(p).bg"
              [style.border]="'1px solid ' + colors().buttonBorder"
              [style.border-radius]="'6px'"
              style="cursor:pointer;min-width:40px;"
            >
              {{ p }}
            </button>
          }
        </div>
        <button
          type="button"
          [disabled]="!hasNextPage"
          (click)="onNext()"
          [style.padding]="'8px 16px'"
          [style.font-size]="'14px'"
          [style.font-weight]="'500'"
          [style.color]="btnStyleNext().color"
          [style.background-color]="btnStyleNext().bg"
          [style.border]="'1px solid ' + colors().buttonBorder"
          [style.border-radius]="'6px'"
          [style.cursor]="hasNextPage ? 'pointer' : 'not-allowed'"
          [style.min-width]="'40px'"
        >
          Next
        </button>
      </div>
    </div>
  `,
})
export class FooterPaginationComponent {
  @Input({ required: true }) currentPage!: FooterRendererProps["currentPage"];
  @Input({ required: true }) endRow!: FooterRendererProps["endRow"];
  @Input({ required: true }) hasNextPage!: FooterRendererProps["hasNextPage"];
  @Input({ required: true }) hasPrevPage!: FooterRendererProps["hasPrevPage"];
  @Input({ required: true }) onNextPage!: FooterRendererProps["onNextPage"];
  @Input({ required: true }) onPageChange!: FooterRendererProps["onPageChange"];
  @Input({ required: true }) onPrevPage!: FooterRendererProps["onPrevPage"];
  @Input({ required: true }) rowsPerPage!: FooterRendererProps["rowsPerPage"];
  @Input({ required: true }) startRow!: FooterRendererProps["startRow"];
  @Input({ required: true }) totalPages!: FooterRendererProps["totalPages"];
  @Input({ required: true }) totalRows!: FooterRendererProps["totalRows"];

  readonly colors = computed(() => palette(footerDemoThemeContext()));

  pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  btnStylePrev(): { color: string; bg: string } {
    const c = this.colors();
    return {
      color: !this.hasPrevPage ? c.buttonDisabled : c.buttonActive,
      bg: c.buttonBg,
    };
  }

  btnStyleNext(): { color: string; bg: string } {
    const c = this.colors();
    return {
      color: !this.hasNextPage ? c.buttonDisabled : c.buttonActive,
      bg: c.buttonBg,
    };
  }

  pageBtnStyle(p: number): { color: string; bg: string } {
    const c = this.colors();
    const active = p === this.currentPage;
    return {
      color: active ? "white" : c.buttonActive,
      bg: active ? c.buttonActive : c.buttonBg,
    };
  }

  onNext(): void {
    void this.onNextPage();
  }
}
