import {
  DestroyRef,
  Directive,
  ElementRef,
  Renderer2,
  computed,
  effect,
  inject,
  input
} from '@angular/core';
import {
  TalosBadgePosition,
  TalosBadgeShape,
  TalosBadgeSize,
  TalosBadgeVariant,
  formatBadgeContent
} from './badge.types';

@Directive({
  selector: '[talosBadge], [talos-badge]',
  host: {
    'class': 'talos-badge-host',
    '[class.talos-badge-host--has-badge]': 'shouldRender()',
    '[attr.aria-label]': 'resolvedHostAriaLabel()'
  }
})
export class TalosBadgeDirective {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly renderer = inject(Renderer2);
  private readonly destroyRef = inject(DestroyRef);

  /**
   * The content to display inside the badge.
   * Can be a number, string, or null/undefined.
   */
  readonly content = input<string | number | null | undefined>(null, {
    alias: 'talosBadge'
  });

  /**
   * Maximum numeric value to display before appending '+'.
   * For example, max = 99 will display 100 as '99+'.
   */
  readonly max = input<number | null | undefined>(undefined, {
    alias: 'talosBadgeMax'
  });

  /**
   * Size scale of the badge.
   * @default 'md'
   */
  readonly size = input<TalosBadgeSize>('md', {
    alias: 'talosBadgeSize'
  });

  /**
   * Anchor position of the badge relative to the host element.
   * @default 'top-right'
   */
  readonly position = input<TalosBadgePosition>('top-right', {
    alias: 'talosBadgePosition'
  });

  /**
   * Visual variant/color theme of the badge.
   * @default 'primary'
   */
  readonly variant = input<TalosBadgeVariant>('primary', {
    alias: 'talosBadgeVariant'
  });

  /**
   * Shape style of the badge container.
   * @default 'circle'
   */
  readonly shape = input<TalosBadgeShape>('circle', {
    alias: 'talosBadgeShape'
  });

  /**
   * Whether to display the badge as a small indicator dot without text content.
   * @default false
   */
  readonly dot = input<boolean>(false, {
    alias: 'talosBadgeDot'
  });

  /**
   * Whether to enable an animated pulse/ripple effect for notifications.
   * @default false
   */
  readonly pulse = input<boolean>(false, {
    alias: 'talosBadgePulse'
  });

  /**
   * Whether the badge is hidden from view.
   * @default false
   */
  readonly hidden = input<boolean>(false, {
    alias: 'talosBadgeHidden'
  });

  /**
   * Whether the badge overlaps the edge of the host component.
   * @default true
   */
  readonly overlap = input<boolean>(true, {
    alias: 'talosBadgeOverlap'
  });

  /**
   * Accessible description/label for screen readers.
   */
  readonly ariaLabel = input<string | null | undefined>(undefined, {
    alias: 'talosBadgeAriaLabel'
  });

  /**
   * Computed formatted text content for the badge.
   */
  readonly formattedContent = computed<string>(() => {
    return formatBadgeContent(this.content(), this.max(), this.dot());
  });

  /**
   * Whether the badge should actively render in the DOM and be visible.
   */
  readonly shouldRender = computed<boolean>(() => {
    if (this.hidden()) {
      return false;
    }
    if (this.dot()) {
      return true;
    }
    const c = this.content();
    return c !== null && c !== undefined && c !== '';
  });

  /**
   * Computed host aria-label override when provided.
   */
  readonly resolvedHostAriaLabel = computed<string | null>(() => {
    const custom = this.ariaLabel();
    if (custom !== undefined && custom !== null && custom.trim().length > 0) {
      return custom;
    }
    return null;
  });

  private badgeElement: HTMLElement | null = null;

  constructor() {
    // Reactive effect to synchronize the badge DOM element whenever signal inputs change
    effect(() => {
      this.updateBadgeDom();
    });

    this.destroyRef.onDestroy(() => {
      this.removeBadgeDom();
    });
  }

  /**
   * Returns the native badge element for inspection or testing.
   */
  get nativeBadgeElement(): HTMLElement | null {
    return this.badgeElement;
  }

  private updateBadgeDom(): void {
    const isVisible = this.shouldRender();

    if (!isVisible) {
      if (this.badgeElement) {
        this.renderer.addClass(this.badgeElement, 'talos-badge--hidden');
        this.renderer.setStyle(this.badgeElement, 'display', 'none');
      }
      return;
    }

    if (!this.badgeElement) {
      this.badgeElement = this.renderer.createElement('span');
      this.renderer.addClass(this.badgeElement, 'talos-badge');
      this.renderer.setAttribute(this.badgeElement, 'aria-hidden', 'true');
      this.renderer.appendChild(this.elementRef.nativeElement, this.badgeElement);
    }

    const badgeEl = this.badgeElement;
    if (!badgeEl) {
      return;
    }

    // Reset visibility styles
    this.renderer.removeClass(badgeEl, 'talos-badge--hidden');
    this.renderer.removeStyle(badgeEl, 'display');

    // Update text content
    const text = this.formattedContent();
    this.renderer.setProperty(badgeEl, 'textContent', text);

    // Apply classes for size, position, variant, shape, etc.
    const size = this.size();
    const pos = this.position();
    const variant = this.variant();
    const shape = this.shape();
    const isDot = this.dot();
    const isPulse = this.pulse();
    const isOverlap = this.overlap();
    const isMultiChar = text.length > 1;

    // Reset base class list and re-apply active classes
    badgeEl.className = 'talos-badge';
    this.renderer.addClass(badgeEl, `talos-badge--${size}`);
    this.renderer.addClass(badgeEl, `talos-badge--${pos}`);
    this.renderer.addClass(badgeEl, `talos-badge--${variant}`);
    this.renderer.addClass(badgeEl, `talos-badge--${shape}`);

    if (isDot) {
      this.renderer.addClass(badgeEl, 'talos-badge--dot');
    }
    if (isPulse) {
      this.renderer.addClass(badgeEl, 'talos-badge--pulse');
    }
    if (isOverlap) {
      this.renderer.addClass(badgeEl, 'talos-badge--overlap');
    }
    if (isMultiChar && !isDot) {
      this.renderer.addClass(badgeEl, 'talos-badge--pill');
    }
  }

  private removeBadgeDom(): void {
    if (this.badgeElement) {
      this.renderer.removeChild(this.elementRef.nativeElement, this.badgeElement);
      this.badgeElement = null;
    }
  }
}
