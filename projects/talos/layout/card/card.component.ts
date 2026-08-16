import {
  Component,
  computed,
  input,
  output
} from '@angular/core';
import { TalosCardPadding, TalosCardVariant } from './card.types';

@Component({
  selector: 'talos-card, [talosCard]',
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
  host: {
    'class': 'talos-card-host',
    '[class.talos-card-elevated]': 'variant() === "elevated"',
    '[class.talos-card-outlined]': 'variant() === "outlined"',
    '[class.talos-card-flat]': 'variant() === "flat"',
    '[class.talos-card-filled]': 'variant() === "filled"',
    '[class.talos-card-padding-none]': 'padding() === "none"',
    '[class.talos-card-padding-sm]': 'padding() === "sm"',
    '[class.talos-card-padding-md]': 'padding() === "md"',
    '[class.talos-card-padding-lg]': 'padding() === "lg"',
    '[class.is-hoverable]': 'hoverable()',
    '[class.is-clickable]': 'isClickable()',
    '[class.is-selected]': 'selected()',
    '[class.is-disabled]': 'disabled()',
    '[attr.role]': 'role()',
    '[attr.tabindex]': 'tabIndex()',
    '[attr.aria-disabled]': 'disabled() ? "true" : null',
    '[attr.aria-selected]': 'selected() ? "true" : null',
    '(click)': 'onClick($event)',
    '(keydown.enter)': 'onKeydown($event)',
    '(keydown.space)': 'onKeydown($event)'
  }
})
export class TalosCardComponent {
  /** Visual style variant of the card */
  readonly variant = input<TalosCardVariant>('elevated');

  /** Inner padding size of the card container */
  readonly padding = input<TalosCardPadding>('md');

  /** Adds hover elevation lift and animated border glow */
  readonly hoverable = input<boolean>(false);

  /** Enables interactive pointer cursor, active state, and keyboard focus */
  readonly clickable = input<boolean>(false);

  /** Indicates if card is in an active selected state */
  readonly selected = input<boolean>(false);

  /** Disables interactions and reduces opacity */
  readonly disabled = input<boolean>(false);

  /** Emitted when the card is clicked or triggered via keyboard */
  readonly cardClick = output<MouseEvent | KeyboardEvent>();

  protected readonly isClickable = computed(() => this.clickable() && !this.disabled());

  protected readonly role = computed(() => {
    if (this.clickable()) {
      return 'button';
    }
    return undefined;
  });

  protected readonly tabIndex = computed(() => {
    if (this.disabled()) {
      return -1;
    }
    if (this.clickable()) {
      return 0;
    }
    return null;
  });

  protected onClick(event: MouseEvent): void {
    if (this.disabled()) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    if (this.clickable()) {
      this.cardClick.emit(event);
    }
  }

  protected onKeydown(event: Event): void {
    if (this.disabled() || !this.clickable()) {
      return;
    }
    const key = event instanceof KeyboardEvent ? event.key : '';
    if (key === 'Enter' || key === ' ') {
      event.preventDefault();
      this.cardClick.emit(event as KeyboardEvent);
    }
  }
}
