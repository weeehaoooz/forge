import { Component, computed, inject, input } from '@angular/core';
import { TalosAlertComponent } from '../alert/alert.component';
import { TalosAlertService } from '../alert.service';
import { TalosAlertInstance } from '../alert.types';

@Component({
  selector: 'talos-alert-container',
  imports: [TalosAlertComponent],
  template: `
    @if (targetAlerts().length > 0) {
      <div class="talos-alert-container-stack" [class.is-banner]="type() === 'banner'">
        @for (item of targetAlerts(); track item.id) {
          <talos-alert
            [variant]="item.variant || 'default'"
            [severity]="item.severity"
            [appearance]="item.appearance || 'subtle'"
            [size]="item.size || 'md'"
            [title]="item.title"
            [message]="item.message"
            [showIcon]="item.showIcon ?? true"
            [icon]="item.icon"
            [showSeverityBadge]="item.showSeverityBadge ?? false"
            [dismissible]="item.dismissible ?? true"
            [actionLabel]="item.actionLabel"
            [bordered]="item.bordered ?? false"
            [customClass]="item.customClass || ''"
            (dismiss)="onDismiss(item.id)"
            (action)="onAction(item)"
          />
        }
      </div>
    }
  `,
  styleUrl: './alert-container.component.scss',
  host: {
    '[class.talos-alert-container-host]': 'true'
  }
})
export class TalosAlertContainerComponent {
  private readonly alertService = inject(TalosAlertService);

  /** Mode of alerts to render from the service ('inline', 'banner', or 'all') */
  readonly type = input<'inline' | 'banner' | 'all'>('inline');

  readonly targetAlerts = computed<TalosAlertInstance[]>(() => {
    const t = this.type();
    if (t === 'banner') {
      return this.alertService.bannerAlerts();
    }
    if (t === 'all') {
      return [...this.alertService.bannerAlerts(), ...this.alertService.alerts()];
    }
    return this.alertService.alerts();
  });

  onDismiss(id: string): void {
    if (this.type() === 'banner') {
      this.alertService.dismissBanner(id);
    } else {
      this.alertService.dismiss(id);
    }
  }

  onAction(item: TalosAlertInstance): void {
    if (item.onAction) {
      item.onAction();
    }
  }
}
