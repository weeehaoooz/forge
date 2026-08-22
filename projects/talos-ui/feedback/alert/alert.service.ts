import {
  Injectable,
  TemplateRef,
  signal
} from '@angular/core';
import {
  TalosAlertConfig,
  TalosAlertInstance,
  TalosAlertRef
} from './alert.types';

@Injectable({
  providedIn: 'root'
})
export class TalosAlertService {
  /** Reactive list of currently active programmatic alerts */
  readonly alerts = signal<TalosAlertInstance[]>([]);

  /** Reactive list of currently active top-level banner alerts */
  readonly bannerAlerts = signal<TalosAlertInstance[]>([]);

  private idCounter = 0;

  /** Default global configurations */
  private defaultConfig: Partial<TalosAlertConfig> = {
    severity: 'success',
    appearance: 'subtle',
    size: 'md',
    showIcon: true,
    dismissible: true
  };

  /**
   * Override default global configurations.
   */
  setDefaultConfig(config: Partial<TalosAlertConfig>): void {
    this.defaultConfig = { ...this.defaultConfig, ...config };
  }

  /**
   * Main entry point to create a programmatic alert instance.
   */
  show(
    messageOrConfig: string | TemplateRef<unknown> | TalosAlertConfig,
    configOverrides: Partial<TalosAlertConfig> = {}
  ): TalosAlertRef {
    let fullConfig: TalosAlertConfig;

    if (
      typeof messageOrConfig === 'string' ||
      messageOrConfig instanceof TemplateRef
    ) {
      fullConfig = {
        message: messageOrConfig,
        ...configOverrides
      };
    } else {
      fullConfig = {
        ...messageOrConfig,
        ...configOverrides
      };
    }

    const instance: TalosAlertInstance = {
      id: fullConfig.id || `talos-alert-${++this.idCounter}-${Date.now()}`,
      severity: fullConfig.severity ?? this.defaultConfig.severity ?? 'success',
      variant: fullConfig.variant,
      appearance: fullConfig.appearance ?? this.defaultConfig.appearance ?? 'subtle',
      size: fullConfig.size ?? this.defaultConfig.size ?? 'md',
      showIcon: fullConfig.showIcon ?? this.defaultConfig.showIcon ?? true,
      icon: fullConfig.icon,
      showSeverityBadge: fullConfig.showSeverityBadge ?? false,
      dismissible: fullConfig.dismissible ?? this.defaultConfig.dismissible ?? true,
      title: fullConfig.title,
      message: fullConfig.message,
      actionLabel: fullConfig.actionLabel,
      onAction: fullConfig.onAction,
      onDismiss: fullConfig.onDismiss,
      customClass: fullConfig.customClass,
      bordered: fullConfig.bordered,
      duration: fullConfig.duration,
      data: fullConfig.data,
      createdAt: Date.now()
    };

    this.alerts.update((current) => [...current, instance]);

    if (instance.duration && instance.duration > 0) {
      setTimeout(() => {
        this.dismiss(instance.id);
      }, instance.duration);
    }

    return {
      id: instance.id,
      dismiss: () => this.dismiss(instance.id)
    };
  }

  /**
   * Display a high-visibility global banner alert.
   */
  banner(
    messageOrConfig: string | TemplateRef<unknown> | TalosAlertConfig,
    configOverrides: Partial<TalosAlertConfig> = {}
  ): TalosAlertRef {
    let fullConfig: TalosAlertConfig;

    if (
      typeof messageOrConfig === 'string' ||
      messageOrConfig instanceof TemplateRef
    ) {
      fullConfig = {
        message: messageOrConfig,
        appearance: 'filled',
        severity: 'info',
        ...configOverrides
      };
    } else {
      fullConfig = {
        appearance: 'filled',
        severity: 'info',
        ...messageOrConfig,
        ...configOverrides
      };
    }

    const instance: TalosAlertInstance = {
      id: fullConfig.id || `talos-banner-alert-${++this.idCounter}-${Date.now()}`,
      severity: fullConfig.severity ?? 'info',
      variant: fullConfig.variant,
      appearance: fullConfig.appearance ?? 'filled',
      size: fullConfig.size ?? 'md',
      showIcon: fullConfig.showIcon ?? true,
      icon: fullConfig.icon,
      showSeverityBadge: fullConfig.showSeverityBadge ?? false,
      dismissible: fullConfig.dismissible ?? true,
      title: fullConfig.title,
      message: fullConfig.message,
      actionLabel: fullConfig.actionLabel,
      onAction: fullConfig.onAction,
      onDismiss: fullConfig.onDismiss,
      customClass: fullConfig.customClass,
      bordered: fullConfig.bordered,
      duration: fullConfig.duration,
      data: fullConfig.data,
      createdAt: Date.now()
    };

    this.bannerAlerts.update((current) => [...current, instance]);

    if (instance.duration && instance.duration > 0) {
      setTimeout(() => {
        this.dismissBanner(instance.id);
      }, instance.duration);
    }

    return {
      id: instance.id,
      dismiss: () => this.dismissBanner(instance.id)
    };
  }

  /** Convenience method for Success alerts (Default severity) */
  success(
    message: string | TemplateRef<unknown>,
    config?: Partial<TalosAlertConfig>
  ): TalosAlertRef {
    return this.show(message, { ...config, severity: 'success' });
  }

  /** Convenience method for Info alerts */
  info(
    message: string | TemplateRef<unknown>,
    config?: Partial<TalosAlertConfig>
  ): TalosAlertRef {
    return this.show(message, { ...config, severity: 'info' });
  }

  /** Convenience method for Warning alerts */
  warning(
    message: string | TemplateRef<unknown>,
    config?: Partial<TalosAlertConfig>
  ): TalosAlertRef {
    return this.show(message, { ...config, severity: 'warning' });
  }

  /** Convenience method for Error alerts */
  error(
    message: string | TemplateRef<unknown>,
    config?: Partial<TalosAlertConfig>
  ): TalosAlertRef {
    return this.show(message, { ...config, severity: 'error' });
  }

  /**
   * Dismiss a specific programmatic alert by ID, or the oldest if no ID is provided.
   */
  dismiss(id?: string): void {
    if (!id) {
      const current = this.alerts();
      if (current.length === 0) return;
      id = current[0].id;
    }

    const target = this.alerts().find((a) => a.id === id);
    if (target?.onDismiss) {
      target.onDismiss();
    }

    this.alerts.update((current) => current.filter((item) => item.id !== id));
  }

  /**
   * Dismiss a banner alert by ID.
   */
  dismissBanner(id?: string): void {
    if (!id) {
      const current = this.bannerAlerts();
      if (current.length === 0) return;
      id = current[0].id;
    }

    const target = this.bannerAlerts().find((a) => a.id === id);
    if (target?.onDismiss) {
      target.onDismiss();
    }

    this.bannerAlerts.update((current) => current.filter((item) => item.id !== id));
  }

  /**
   * Dismiss all currently active alerts and banners.
   */
  dismissAll(): void {
    this.alerts().forEach((a) => a.onDismiss?.());
    this.bannerAlerts().forEach((b) => b.onDismiss?.());
    this.alerts.set([]);
    this.bannerAlerts.set([]);
  }
}
