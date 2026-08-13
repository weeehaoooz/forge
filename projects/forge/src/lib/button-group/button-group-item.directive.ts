import { Directive, ElementRef, inject, input, signal } from '@angular/core';

@Directive({
  selector: 'button[forgeButtonGroupItem], a[forgeButtonGroupItem], [forge-button-group-item]',
  host: {
    'class': 'forge-button-group-item',
    '[class.is-selected]': 'selected()',
    '[class.is-active]': 'selected()',
    '[attr.aria-pressed]': 'selected() ? "true" : "false"'
  }
})
export class ForgeButtonGroupItemDirective {
  readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  /** Value associated with this button item in selection mode */
  readonly value = input<any>(undefined);

  /** Explicit selected / active state override */
  readonly selected = signal<boolean>(false);

  /** Focus target method */
  focus(): void {
    this.elementRef.nativeElement.focus();
  }
}
