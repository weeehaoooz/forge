import { NgComponentOutlet } from '@angular/common';
import { Component, Type, computed, inject, input, output } from '@angular/core';
import { LayoutService } from '@daedal-dev/talos-ui/layout';

@Component({
  selector: 'talos-nav-item',
  imports: [NgComponentOutlet],
  template: `
    <button
      type="button"
      class="nav-link"
      [class.active]="active()"
      [disabled]="disabled()"
      (click)="handleClick()"
      [attr.aria-current]="active() ? 'page' : null"
      [attr.data-tooltip]="computedTooltip()">
      @if (icon(); as iconComp) {
        <span class="nav-icon">
          <ng-container *ngComponentOutlet="iconComp" />
        </span>
      }
      <span class="nav-label">
        @if (label()) {
          {{ label() }}
        } @else {
          <ng-content />
        }
      </span>
      @if (badge(); as b) {
        <span class="nav-badge">{{ b }}</span>
      }
    </button>
  `,
  host: {
    'class': 'nav-item talos-nav-item',
    'role': 'listitem'
  }
})
export class TalosNavItemComponent {
  protected readonly layoutService = inject(LayoutService, { optional: true });

  /** Text label for the nav item */
  readonly label = input<string>('');

  /** Icon component type (e.g. Lucide icon) */
  readonly icon = input<Type<unknown> | null>(null);

  /** Whether the item is currently active */
  readonly active = input<boolean>(false);

  /** Badge or counter displayed on the right */
  readonly badge = input<string | number | undefined>(undefined);

  /** Whether the nav item is disabled */
  readonly disabled = input<boolean>(false);

  /** Optional route path */
  readonly route = input<string | undefined>(undefined);

  /** Optional custom tooltip text when collapsed */
  readonly tooltip = input<string | undefined>(undefined);

  /** Output event when the nav item is clicked */
  readonly itemClick = output<void>();

  /** Computed tooltip for collapsed sidebar state */
  readonly computedTooltip = computed(() => {
    const isCollapsed = this.layoutService?.isLeftNavCollapsed() ?? false;
    if (!isCollapsed) return null;
    return this.tooltip() || this.label() || null;
  });

  handleClick(): void {
    if (this.disabled()) return;
    this.itemClick.emit();
  }
}
