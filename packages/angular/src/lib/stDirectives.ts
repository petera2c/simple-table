import { Directive, ElementRef, Input, OnChanges, OnDestroy, TemplateRef, inject } from "@angular/core";

/**
 * Page-template cell for a column, matched by `accessor`.
 * Context: `$implicit` is `row`; also `value`, `formattedValue`, and the rest of
 * the core cell renderer props.
 */
@Directive({
  selector: "ng-template[stCell]",
  standalone: true,
})
export class StCellDirective {
  @Input({ required: true }) stCell!: string;
  readonly templateRef = inject(TemplateRef);
}

/**
 * Page-template header for a column, matched by `accessor`.
 * Context: `$implicit` is `header`; also `components` (sort/filter icons).
 */
@Directive({
  selector: "ng-template[stHeader]",
  standalone: true,
})
export class StHeaderDirective {
  @Input({ required: true }) stHeader!: string;
  readonly templateRef = inject(TemplateRef);
}

/** Whole-table empty UI. Shown when there are no rows. */
@Directive({
  selector: "ng-template[stEmpty]",
  standalone: true,
})
export class StEmptyDirective {
  readonly templateRef = inject(TemplateRef);
}

/** Pagination / custom footer. Context matches core footer renderer props. */
@Directive({
  selector: "ng-template[stFooter]",
  standalone: true,
})
export class StFooterDirective {
  readonly templateRef = inject(TemplateRef);
}

/** Nested-group loading row (not the table-level skeleton `isLoading` flag). */
@Directive({
  selector: "ng-template[stLoading]",
  standalone: true,
})
export class StLoadingDirective {
  readonly templateRef = inject(TemplateRef);
}

/** Nested-group error row. */
@Directive({
  selector: "ng-template[stError]",
  standalone: true,
})
export class StErrorDirective {
  readonly templateRef = inject(TemplateRef);
}

/**
 * Opt-in: put a core-built DOM node (sort icon, filter icon, …) into the host.
 * Clones the node so the table can still own the original.
 */
@Directive({
  selector: "[stDomSlot]",
  standalone: true,
})
export class StDomSlotDirective implements OnChanges, OnDestroy {
  @Input() stDomSlot: string | Node | null | undefined;
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  ngOnChanges(): void {
    this.sync();
  }

  ngOnDestroy(): void {
    this.host.nativeElement.replaceChildren();
  }

  private sync(): void {
    const el = this.host.nativeElement;
    el.replaceChildren();
    const slot = this.stDomSlot;
    if (slot == null) return;
    if (typeof slot === "string") {
      el.textContent = slot;
      return;
    }
    if (slot instanceof Node) {
      el.appendChild(slot.cloneNode(true));
    }
  }
}
