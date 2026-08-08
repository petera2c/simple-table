import { Component } from "@angular/core";

@Component({
  standalone: true,
  selector: "demo-icon-sort-up",
  template: `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  `,
})
export class DemoSortUpIconComponent {}

@Component({
  standalone: true,
  selector: "demo-icon-sort-down",
  template: `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 5v14M19 12l-7 7-7-7" />
    </svg>
  `,
})
export class DemoSortDownIconComponent {}

@Component({
  standalone: true,
  selector: "demo-icon-filter",
  template: `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3 4h18l-7 8.5V18l-4 2V12.5L3 4z" />
    </svg>
  `,
})
export class DemoFilterIconComponent {}

@Component({
  standalone: true,
  selector: "demo-icon-expand",
  template: `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M9 5l7 7-7 7" />
    </svg>
  `,
})
export class DemoExpandIconComponent {}

@Component({
  standalone: true,
  selector: "demo-icon-next",
  template: `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M9 5l7 7-7 7" />
    </svg>
  `,
})
export class DemoNextIconComponent {}

@Component({
  standalone: true,
  selector: "demo-icon-prev",
  template: `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M15 19l-7-7 7-7" />
    </svg>
  `,
})
export class DemoPrevIconComponent {}
