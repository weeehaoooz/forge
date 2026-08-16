import { Directive, ElementRef, inject, input } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'subtle' | 'danger' | 'success' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Directive({
  selector: 'button[talosButton], a[talosButton], button[talos-btn], a[talos-btn]',
  host: {
    'class': 'talos-btn',
    '[class.talos-btn-primary]': 'variant() === "primary"',
    '[class.talos-btn-secondary]': 'variant() === "secondary"',
    '[class.talos-btn-outline]': 'variant() === "outline"',
    '[class.talos-btn-ghost]': 'variant() === "ghost" || variant() === "subtle"',
    '[class.talos-btn-danger]': 'variant() === "danger"',
    '[class.talos-btn-success]': 'variant() === "success"',
    '[class.talos-btn-link]': 'variant() === "link"',
    '[class.talos-btn-sm]': 'size() === "sm"',
    '[class.talos-btn-md]': 'size() === "md"',
    '[class.talos-btn-lg]': 'size() === "lg"',
    '[class.talos-btn-icon]': 'iconOnly()',
    '[class.talos-btn-full]': 'fullWidth()',
    '[class.talos-btn-pill]': 'pill()',
    '[class.is-loading]': 'loading()',
    '[attr.disabled]': '(disabled() || loading()) ? true : null',
    '[attr.aria-disabled]': '(disabled() || loading()) ? "true" : null',
    '(pointerdown)': 'onPointerDown($event)'
  }
})
export class TalosButtonDirective {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  /** Button visual style variant */
  readonly variant = input<ButtonVariant>('primary');

  /** Button size variant */
  readonly size = input<ButtonSize>('md');

  /** Whether button has square aspect ratio for icon-only display */
  readonly iconOnly = input<boolean>(false);

  /** Expand button to fill 100% width of parent container */
  readonly fullWidth = input<boolean>(false);

  /** Apply fully rounded pill shape */
  readonly pill = input<boolean>(false);

  /** Show loading spinner and disable interactive events */
  readonly loading = input<boolean>(false);

  /** Disable button interaction */
  readonly disabled = input<boolean>(false);

  onPointerDown(event: Event): void {
    if (this.disabled() || this.loading()) return;
    const pe = event as PointerEvent;
    const el = this.elementRef.nativeElement;
    const rect = el.getBoundingClientRect();
    const x = pe.clientX - rect.left;
    const y = pe.clientY - rect.top;
    el.style.setProperty('--ripple-x', `${x}px`);
    el.style.setProperty('--ripple-y', `${y}px`);
  }
}
