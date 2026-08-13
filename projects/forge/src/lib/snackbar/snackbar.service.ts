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
  ForgeSnackbarConfig,
  ForgeSnackbarInstance,
  ForgeSnackbarRef,
  ForgeSnackbarVariant
} from './snackbar.types';
import { ForgeSnackbarContainerComponent } from './snackbar-container.component';

@Injectable({
  providedIn: 'root'
})
export class ForgeSnackbarService {
  private readonly overlay = inject(Overlay);
  private overlayRef: OverlayRef | null = null;

  /** Reactive list of currently active snackbar instances */
  readonly snackbars = signal<ForgeSnackbarInstance[]>([]);

  private idCounter = 0;

  /** Global default configuration values */
  private defaultConfig: Partial<ForgeSnackbarConfig> = {
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
  setDefaultConfig(config: Partial<ForgeSnackbarConfig>): void {
    this.defaultConfig = { ...this.defaultConfig, ...config };
  }

  /**
   * Main entry point to open a configured snackbar.
   */
  show(
    messageOrConfig: string | TemplateRef<unknown> | ForgeSnackbarConfig,
    configOverrides: Partial<ForgeSnackbarConfig> = {}
  ): ForgeSnackbarRef {
    let fullConfig: ForgeSnackbarConfig;

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

    const merged: ForgeSnackbarInstance = {
      id: `forge-sb-${++this.idCounter}-${Date.now()}`,
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
    config?: Partial<ForgeSnackbarConfig>
  ): ForgeSnackbarRef {
    return this.show(message, { ...config, variant: 'success' });
  }

  /** Convenience method for Error variant snackbars */
  error(
    message: string | TemplateRef<unknown>,
    config?: Partial<ForgeSnackbarConfig>
  ): ForgeSnackbarRef {
    return this.show(message, { ...config, variant: 'error' });
  }

  /** Convenience method for Warning variant snackbars */
  warning(
    message: string | TemplateRef<unknown>,
    config?: Partial<ForgeSnackbarConfig>
  ): ForgeSnackbarRef {
    return this.show(message, { ...config, variant: 'warning' });
  }

  /** Convenience method for Info variant snackbars */
  info(
    message: string | TemplateRef<unknown>,
    config?: Partial<ForgeSnackbarConfig>
  ): ForgeSnackbarRef {
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
        panelClass: 'forge-snackbar-overlay-panel'
      });

      const portal = new ComponentPortal(ForgeSnackbarContainerComponent);
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
