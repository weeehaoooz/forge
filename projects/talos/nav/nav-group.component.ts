import { Component, input, model } from '@angular/core';
import { LucideChevronDown } from '@lucide/angular';

@Component({
  selector: 'talos-nav-group',
  imports: [LucideChevronDown],
  template: `
    @if (title(); as groupTitle) {
      @if (collapsible()) {
        <button
          type="button"
          class="nav-group-title nav-group-header-btn"
          [attr.aria-expanded]="!collapsed()"
          (click)="toggleCollapse()">
          <span class="nav-group-title-text">{{ groupTitle }}</span>
          <span class="nav-group-chevron" [class.is-collapsed]="collapsed()">
            <svg lucideChevronDown [size]="14"></svg>
          </span>
        </button>
      } @else {
        <div class="nav-group-title">{{ groupTitle }}</div>
      }
    }
    <div class="nav-group-content" [class.is-collapsed]="collapsible() && collapsed()">
      <ul class="nav-item-list">
        <ng-content />
      </ul>
    </div>
  `,
  host: {
    'class': 'nav-group talos-nav-group',
    '[class.is-collapsible]': 'collapsible()',
    '[class.is-collapsed]': 'collapsible() && collapsed()',
    'role': 'group'
  }
})
export class TalosNavGroupComponent {
  /** Optional title for the navigation group */
  readonly title = input<string | undefined>(undefined);

  /** Whether the navigation group is collapsible */
  readonly collapsible = input<boolean>(false);

  /** Two-way model signal for the collapsed state */
  readonly collapsed = model<boolean>(false);

  /** Toggle the collapsed state */
  toggleCollapse(): void {
    if (!this.collapsible()) return;
    this.collapsed.update((c) => !c);
  }
}

