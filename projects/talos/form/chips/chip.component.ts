import { Component, computed, input, output } from '@angular/core';
import { ChipColor, ChipSize, ChipVariant } from './chips.types';

@Component({
  selector: 'talos-chip',
  templateUrl: './chip.component.html',
  styleUrl: './chip.component.scss',
  host: {
    'class': 'talos-chip',
    '[class.talos-chip-sm]': 'size() === "sm"',
    '[class.talos-chip-md]': 'size() === "md"',
    '[class.talos-chip-lg]': 'size() === "lg"',
    '[class.talos-chip-filled]': 'variant() === "filled"',
    '[class.talos-chip-outline]': 'variant() === "outline"',
    '[class.talos-chip-subtle]': 'variant() === "subtle"',
    '[class.talos-chip-primary]': 'color() === "primary"',
    '[class.talos-chip-neutral]': 'color() === "neutral"',
    '[class.talos-chip-success]': 'color() === "success"',
    '[class.talos-chip-warning]': 'color() === "warning"',
    '[class.talos-chip-error]': 'color() === "error"',
    '[class.talos-chip-indigo]': 'color() === "indigo"',
    '[class.talos-chip-purple]': 'color() === "purple"',
    '[class.talos-chip-cyan]': 'color() === "cyan"',
    '[class.is-disabled]': 'disabled()',
    '[class.is-removable]': 'removable() && !disabled()',
    '[attr.aria-disabled]': 'disabled() ? "true" : null',
    '(click)': 'onChipClick($event)'
  }
})
export class TalosChipComponent {
  readonly label = input<string>('');
  readonly value = input<unknown>(null);
  readonly size = input<ChipSize>('sm');
  readonly variant = input<ChipVariant>('subtle');
  readonly color = input<ChipColor>('primary');
  readonly removable = input<boolean>(true);
  readonly disabled = input<boolean>(false);
  readonly avatarUrl = input<string>('');
  readonly removeAriaLabel = input<string>('Remove');

  readonly removed = output<unknown>();
  readonly chipClick = output<unknown>();

  readonly hasAvatar = computed(() => !!this.avatarUrl());

  onChipClick(event: MouseEvent): void {
    if (this.disabled()) return;
    this.chipClick.emit(this.value() ?? this.label());
  }

  onRemove(event: MouseEvent): void {
    event.stopPropagation();
    event.preventDefault();
    if (this.disabled()) return;
    this.removed.emit(this.value() ?? this.label());
  }
}
