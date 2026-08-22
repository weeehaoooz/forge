import { Component, computed, inject, input, output } from '@angular/core';
import { LucideMoon, LucideSun } from '@lucide/angular';
import { LayoutService } from '@daedal-dev/talos-ui/layout';

@Component({
  selector: 'talos-nav-theme-toggle',
  imports: [LucideSun, LucideMoon],
  template: `
    <button
      type="button"
      class="theme-toggle-btn"
      (click)="handleToggle()"
      [attr.aria-label]="isDarkMode() ? ('Switch to ' + lightLabel()) : ('Switch to ' + darkLabel())"
      [attr.data-tooltip]="computedTooltip()">
      <span class="theme-toggle-icon">
        @if (isDarkMode()) {
          <svg lucideSun [size]="16"></svg>
        } @else {
          <svg lucideMoon [size]="16"></svg>
        }
      </span>
      @if (showLabel()) {
        <span class="theme-toggle-label">{{ isDarkMode() ? lightLabel() : darkLabel() }}</span>
      }
      <span class="theme-toggle-indicator" [class.is-dark]="isDarkMode()" aria-hidden="true">
        <span class="indicator-thumb"></span>
      </span>
    </button>
  `,
  host: {
    'class': 'talos-nav-theme-toggle-host'
  }
})
export class TalosNavThemeToggleComponent {
  protected readonly layoutService = inject(LayoutService, { optional: true });

  /** Current dark mode state */
  readonly isDarkMode = input<boolean>(false);

  /** Whether to show the text label beside the toggle */
  readonly showLabel = input<boolean>(true);

  /** Label shown when in dark mode (prompting switch to Light Mode) */
  readonly lightLabel = input<string>('Light Mode');

  /** Label shown when in light mode (prompting switch to Dark Mode) */
  readonly darkLabel = input<string>('Dark Mode');

  /** Optional custom tooltip text when collapsed */
  readonly tooltip = input<string | undefined>(undefined);

  /** Output event when the toggle is clicked */
  readonly themeToggle = output<void>();

  /** Output event with next dark mode state */
  readonly isDarkModeChange = output<boolean>();

  /** Computed tooltip for collapsed sidebar state */
  readonly computedTooltip = computed(() => {
    const isCollapsed = this.layoutService?.isLeftNavCollapsed() ?? false;
    if (!isCollapsed) return null;
    return this.tooltip() || (this.isDarkMode() ? this.lightLabel() : this.darkLabel());
  });

  handleToggle(): void {
    this.themeToggle.emit();
    this.isDarkModeChange.emit(!this.isDarkMode());
  }
}
