import {
  Component,
  ViewChild,
  ViewContainerRef,
  OnInit,
  OnDestroy,
} from "@angular/core";
import { DEMO_LIST } from "@simple-table/examples-shared";
import { QuickStartDemoComponent } from "./demos/quick-start/quick-start-demo.component";
import { ColumnFilteringDemoComponent } from "./demos/column-filtering/column-filtering-demo.component";
import { ColumnSortingDemoComponent } from "./demos/column-sorting/column-sorting-demo.component";
import { ValueFormatterDemoComponent } from "./demos/value-formatter/value-formatter-demo.component";
import { PaginationDemoComponent } from "./demos/pagination/pagination-demo.component";

const REGISTRY: Record<string, any> = {
  "quick-start": QuickStartDemoComponent,
  "column-filtering": ColumnFilteringDemoComponent,
  "column-sorting": ColumnSortingDemoComponent,
  "value-formatter": ValueFormatterDemoComponent,
  "pagination": PaginationDemoComponent,
};

@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    QuickStartDemoComponent,
    ColumnFilteringDemoComponent,
    ColumnSortingDemoComponent,
    ValueFormatterDemoComponent,
    PaginationDemoComponent,
  ],
  template: `
    <div class="examples-shell">
      <aside class="examples-sidebar">
        <div class="examples-sidebar-header">Angular Examples</div>
        <nav>
          <ul class="examples-sidebar-nav">
            @for (demo of demos; track demo.id) {
              <li>
                <button
                  class="examples-sidebar-link"
                  [class.active]="demo.id === activeDemo"
                  (click)="selectDemo(demo.id)"
                >
                  {{ demo.label }}
                </button>
              </li>
            }
          </ul>
        </nav>
      </aside>
      <main class="examples-content">
        <ng-container #demoHost></ng-container>
      </main>
    </div>
  `,
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild("demoHost", { read: ViewContainerRef, static: true })
  demoHost!: ViewContainerRef;

  demos = DEMO_LIST;
  activeDemo = "quick-start";

  private height: string | undefined;
  private theme: string | undefined;
  private popStateHandler: (() => void) | null = null;

  ngOnInit(): void {
    const params = new URLSearchParams(window.location.search);
    this.activeDemo = params.get("demo") || "quick-start";
    this.height = params.get("height") || undefined;
    this.theme = params.get("theme") || undefined;

    this.loadDemo(this.activeDemo);

    this.popStateHandler = () => {
      const p = new URLSearchParams(window.location.search);
      this.activeDemo = p.get("demo") || "quick-start";
      this.loadDemo(this.activeDemo);
    };
    window.addEventListener("popstate", this.popStateHandler);
  }

  ngOnDestroy(): void {
    if (this.popStateHandler) {
      window.removeEventListener("popstate", this.popStateHandler);
    }
  }

  selectDemo(id: string): void {
    this.activeDemo = id;
    const url = new URL(window.location.href);
    url.searchParams.set("demo", id);
    window.history.pushState({}, "", url);
    this.loadDemo(id);
  }

  private loadDemo(id: string): void {
    this.demoHost.clear();
    const component = REGISTRY[id];
    if (component) {
      const ref = this.demoHost.createComponent(component);
      if (this.height) ref.setInput("height", this.height);
      if (this.theme) ref.setInput("theme", this.theme);
    }
  }
}
