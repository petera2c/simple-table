import { Component, Input } from "@angular/core";
import type { FooterRendererProps } from "@simple-table/angular";
import { generateVisiblePages } from "./crm.demo-data";
import { crmFooterPalette, crmRowsPerPageSignal as crmRowsPerPageStore } from "./crm-demo-context";

@Component({
  standalone: true,
  selector: "demo-crm-footer",
  template: `
    <div
      style="display:flex;align-items:center;justify-content:space-between;padding:12px 16px;"
      [style.border-top]="'1px solid ' + c().border"
      [style.background-color]="c().bg"
    >
      <p style="font-size:14px;margin:0;" [style.color]="c().text">
        Showing <span style="font-weight:500;">{{ startRow }}</span> to
        <span style="font-weight:500;">{{ endRow }}</span> of
        <span style="font-weight:500;">{{ totalRows }}</span> results
      </p>
      <div style="display:flex;align-items:center;gap:16px;">
        <div style="display:flex;align-items:center;gap:8px;">
          <label style="font-size:14px;" [style.color]="c().text" for="crm-rpp-angular">Show:</label>
          <select
            id="crm-rpp-angular"
            style="border-radius:6px;padding:4px 8px;font-size:14px;cursor:pointer;"
            [style.border]="'1px solid ' + c().inputBorder"
            [style.background-color]="c().inputBg"
            [style.color]="c().text"
            [value]="crmRowsPerPageSignal()"
            (change)="onRowsChange($event)"
          >
            @for (opt of perPageOptions; track opt) {
              <option [value]="String(opt)">{{ opt === 10000 ? "all" : opt }}</option>
            }
          </select>
          <span style="font-size:14px;" [style.color]="c().text">per page</span>
        </div>
        <nav style="display:inline-flex;border-radius:6px;box-shadow:0 1px 2px 0 rgba(0,0,0,0.05);">
          <button
            type="button"
            [disabled]="!hasPrevPage"
            (click)="onPrevPage()"
            [attr.style]="btnStyle(!hasPrevPage, false, '8px', 'border-top-left-radius:6px;border-bottom-left-radius:6px;')"
          >
            ‹
          </button>
          @for (page of visiblePages; track page; let idx = $index) {
            <button
              type="button"
              (click)="onPageChange(page)"
              [attr.style]="btnStyle(false, page === currentPage, '8px 16px', idx === 0 ? '' : 'margin-left:-1px;')"
            >
              {{ page }}
            </button>
          }
          <button
            type="button"
            [disabled]="!hasNextPage"
            (click)="onNext()"
            [attr.style]="
              btnStyle(!hasNextPage, false, '8px', 'border-top-right-radius:6px;border-bottom-right-radius:6px;margin-left:-1px;')
            "
          >
            ›
          </button>
        </nav>
      </div>
    </div>
  `,
})
export class CrmFooterComponent {
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

  protected readonly crmRowsPerPageSignal = crmRowsPerPageSignal;
  readonly perPageOptions = [25, 50, 100, 200, 10000] as const;

  c() {
    return crmFooterPalette();
  }

  get visiblePages(): number[] {
    return generateVisiblePages(this.currentPage, this.totalPages);
  }

  btnStyle(disabled: boolean, active: boolean, padding: string, extra: string): string {
    const c = this.c();
    const color = active ? c.activeText : disabled ? c.buttonText : c.text;
    const bg = active ? c.activeBg : c.buttonBg;
    return `display:inline-flex;align-items:center;padding:${padding};border:1px solid ${c.buttonBorder};background-color:${bg};font-size:14px;font-weight:500;color:${color};cursor:${disabled ? "not-allowed" : "pointer"};opacity:${disabled ? "0.5" : "1"};${extra}`;
  }

  onRowsChange(ev: Event): void {
    const v = parseInt((ev.target as HTMLSelectElement).value, 10);
    crmRowsPerPageStore.set(v);
    this.onPageChange(1);
  }

  onNext(): void {
    void this.onNextPage();
  }
}
