import {
  Component,
  TemplateRef,
  Type,
  computed,
  input,
  output,
  signal
} from '@angular/core';
import { NgComponentOutlet, NgTemplateOutlet } from '@angular/common';
import {
  LucideAlertOctagon,
  LucideAlertTriangle,
  LucideCheckCircle2,
  LucideCircleAlert,
  LucideInfo,
  LucideShieldAlert,
  LucideX
} from '@lucide/angular';
import {
  TalosAlertAppearance,
  TalosAlertSeverity,
  TalosAlertSize,
  TalosAlertVariant
} from '../alert.types';

@Component({
  selector: 'talos-alert',
  imports: [
    NgComponentOutlet,
    NgTemplateOutlet,
    LucideInfo,
    LucideCheckCircle2,
    LucideAlertTriangle,
    LucideCircleAlert,
    LucideAlertOctagon,
    LucideShieldAlert,
    LucideX
  ],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss',
  host: {
    '[class.talos-alert-host]': 'true',
    '[class.is-dismissing]': 'isDismissing()',
    '[class.is-dismissed]': 'isDismissed()'
  }
})
export class TalosAlertComponent {
  /** Alert severity state: 'success' (default), 'info', 'warning', 'error' */
  readonly severity = input<TalosAlertSeverity | undefined>('success');

  /** Visual variant theme fallback */
  readonly variant = input<TalosAlertVariant | undefined>(undefined);

  /** Visual surface appearance style */
  readonly appearance = input<TalosAlertAppearance>('subtle');

  /** Sizing of padding and typography */
  readonly size = input<TalosAlertSize>('md');

  /** Header title text or custom TemplateRef */
  readonly title = input<string | TemplateRef<unknown> | undefined>(undefined);

  /** Main message content or custom TemplateRef */
  readonly message = input<string | TemplateRef<unknown> | undefined>(undefined);

  /** Whether to display the icon */
  readonly showIcon = input<boolean>(true);

  /** Custom Lucide icon component, TemplateRef, or boolean */
  readonly icon = input<Type<unknown> | TemplateRef<unknown> | boolean | null | undefined>(null);

  /** Whether to display a dedicated severity pill badge */
  readonly showSeverityBadge = input<boolean>(false);

  /** Whether the alert can be dismissed */
  readonly dismissible = input<boolean>(false);

  /** Action button text label */
  readonly actionLabel = input<string | undefined>(undefined);

  /** Optional explicit border outline */
  readonly bordered = input<boolean>(false);

  /** Additional CSS class */
  readonly customClass = input<string>('');

  /** Emitted when dismiss close button is clicked */
  readonly dismiss = output<void>();

  /** Emitted when action button is clicked */
  readonly action = output<void>();

  /** Emitted when dismiss animation has finished and alert is removed */
  readonly closed = output<void>();

  protected readonly isDismissing = signal<boolean>(false);
  protected readonly isDismissed = signal<boolean>(false);

  /** Resolved visual variant considering severity */
  readonly resolvedVariant = computed<TalosAlertVariant>(() => {
    const sev = this.severity();
    if (sev) {
      return sev;
    }
    return this.variant() ?? 'success';
  });

  /** Severity display label for badge */
  readonly severityLabel = computed<string>(() => {
    const sev = this.severity();
    if (sev) return sev.toUpperCase();
    return '';
  });

  readonly isTitleTemplate = computed(() => this.title() instanceof TemplateRef);
  readonly titleTemplate = computed(() => this.title() as TemplateRef<unknown>);

  readonly isMessageTemplate = computed(() => this.message() instanceof TemplateRef);
  readonly messageTemplate = computed(() => this.message() as TemplateRef<unknown>);

  readonly isIconTemplate = computed(() => this.icon() instanceof TemplateRef);
  readonly iconTemplate = computed(() => this.icon() as TemplateRef<unknown>);

  readonly customIconComponent = computed(() => {
    const ic = this.icon();
    return typeof ic === 'function' ? (ic as Type<unknown>) : null;
  });

  readonly ariaRole = computed(() => {
    const v = this.resolvedVariant();
    return v === 'error' || v === 'warning' || v === 'critical' ? 'alert' : 'status';
  });

  readonly ariaLive = computed(() => {
    const v = this.resolvedVariant();
    return v === 'error' || v === 'critical' ? 'assertive' : 'polite';
  });

  protected onActionClick(): void {
    this.action.emit();
  }

  protected onCloseClick(): void {
    if (this.isDismissing() || this.isDismissed()) return;
    this.isDismissing.set(true);
    this.dismiss.emit();

    setTimeout(() => {
      this.isDismissed.set(true);
      this.closed.emit();
    }, 200);
  }
}
