import {
  Injectable,
  TemplateRef,
  inject,
  signal,
  ApplicationRef,
  EnvironmentInjector,
  createComponent,
  ComponentRef
} from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import {
  TalosSnackbarConfig,
  TalosSnackbarInstance,
  TalosSnackbarRef,
  TalosSnackbarVariant
} from './snackbar.types';
import { TalosSnackbarContainerComponent } from './snackbar-container.component';

@Injectable({
  providedIn: 'root'
})
export class TalosSnackbarService {
  private readonly overlay = inject(Overlay);
  private overlayRef: OverlayRef | null = null;

  /** Reactive list of currently active snackbar instances */
  readonly snackbars = signal<TalosSnackbarInstance[]>([]);

  private idCounter = 0;

  /** Global default configuration values */
  private defaultConfig: Partial<TalosSnackbarConfig> = {
    variant: 'default',
    position: 'bottom-right',
    duration: 4000,
    dismissible: true,
    showProgressBar: true,
    pauseOnHover: true,
    icon: true
  };

  /**
   * Override default global configurations for all subsequent snackbars.
   */
  setDefaultConfig(config: Partial<TalosSnackbarConfig>): void {
    this.defaultConfig = { ...this.defaultConfig, ...config };
  }

  /**
   * Main entry point to open a configured snackbar.
   */
  show(
    messageOrConfig: string | TemplateRef<unknown> | TalosSnackbarConfig,
    configOverrides: Partial<TalosSnackbarConfig> = {}
  ): TalosSnackbarRef {
    let fullConfig: TalosSnackbarConfig;

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

    const merged: TalosSnackbarInstance = {
      id: `talos-sb-${++this.idCounter}-${Date.now()}`,
      variant: fullConfig.variant ?? this.defaultConfig.variant ?? 'default',
      position: fullConfig.position ?? this.defaultConfig.position ?? 'bottom-right',
      duration: fullConfig.duration ?? this.defaultConfig.duration ?? 4000,
      dismissible: fullConfig.dismissible ?? this.defaultConfig.dismissible ?? true,
      showProgressBar: fullConfig.showProgressBar ?? this.defaultConfig.showProgressBar ?? true,
      pauseOnHover: fullConfig.pauseOnHover ?? this.defaultConfig.pauseOnHover ?? true,
      icon: fullConfig.icon ?? this.defaultConfig.icon ?? true,
      message: fullConfig.message,
      title: fullConfig.title,
      actionLabel: fullConfig.actionLabel,
      onAction: fullConfig.onAction,
      onDismiss: fullConfig.onDismiss,
      customClass: fullConfig.customClass,
      data: fullConfig.data,
      createdAt: Date.now(),
      isPaused: false
    };

    this.ensureOverlayCreated();

    this.snackbars.update((current) => [...current, merged]);

    return {
      id: merged.id,
      dismiss: () => this.dismiss(merged.id)
    };
  }

  /** Convenience method for Success variant snackbars */
  success(
    message: string | TemplateRef<unknown>,
    config?: Partial<TalosSnackbarConfig>
  ): TalosSnackbarRef {
    return this.show(message, { ...config, variant: 'success' });
  }

  /** Convenience method for Error variant snackbars */
  error(
    message: string | TemplateRef<unknown>,
    config?: Partial<TalosSnackbarConfig>
  ): TalosSnackbarRef {
    return this.show(message, { ...config, variant: 'error' });
  }

  /** Convenience method for Warning variant snackbars */
  warning(
    message: string | TemplateRef<unknown>,
    config?: Partial<TalosSnackbarConfig>
  ): TalosSnackbarRef {
    return this.show(message, { ...config, variant: 'warning' });
  }

  /** Convenience method for Info variant snackbars */
  info(
    message: string | TemplateRef<unknown>,
    config?: Partial<TalosSnackbarConfig>
  ): TalosSnackbarRef {
    return this.show(message, { ...config, variant: 'info' });
  }

  /**
   * Dismiss a specific snackbar by ID, or the oldest active snackbar if no ID is specified.
   */
  dismiss(id?: string): void {
    if (!id) {
      const current = this.snackbars();
      if (current.length === 0) return;
      id = current[0].id;
    }

    this.snackbars.update((current) => current.filter((item) => item.id !== id));

    if (this.snackbars().length === 0) {
      this.destroyOverlay();
    }
  }

  /**
   * Dismiss all currently active snackbars.
   */
  dismissAll(): void {
    this.snackbars.set([]);
    this.destroyOverlay();
  }

  private ensureOverlayCreated(): void {
    if (!this.overlayRef) {
      const positionStrategy = this.overlay.position().global();
      this.overlayRef = this.overlay.create({
        positionStrategy,
        hasBackdrop: false,
        panelClass: 'talos-snackbar-overlay-panel'
      });

      const portal = new ComponentPortal(TalosSnackbarContainerComponent);
      this.overlayRef.attach(portal);
    }
  }

  private destroyOverlay(): void {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
  }
}
