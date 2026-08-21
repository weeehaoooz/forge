import { Directive } from '@angular/core';

/**
 * Structural / Slot directive for alert title projection.
 *
 * Usage:
 * ```html
 * <talos-alert>
 *   <div talosAlertTitle>System Maintenance</div>
 *   <div talosAlertDescription>All services will undergo updates tonight.</div>
 * </talos-alert>
 * ```
 */
@Directive({
  selector: '[talosAlertTitle], talos-alert-title',
  host: {
    'class': 'talos-alert-title-directive'
  }
})
export class TalosAlertTitleDirective {}

/**
 * Slot directive for alert description / message body.
 */
@Directive({
  selector: '[talosAlertDescription], talos-alert-description',
  host: {
    'class': 'talos-alert-description-directive'
  }
})
export class TalosAlertDescriptionDirective {}

/**
 * Slot directive for custom alert actions / button group.
 */
@Directive({
  selector: '[talosAlertActions], talos-alert-actions',
  host: {
    'class': 'talos-alert-actions-directive'
  }
})
export class TalosAlertActionsDirective {}

/**
 * Slot directive for custom alert icon.
 */
@Directive({
  selector: '[talosAlertIcon], talos-alert-icon',
  host: {
    'class': 'talos-alert-icon-directive'
  }
})
export class TalosAlertIconDirective {}
