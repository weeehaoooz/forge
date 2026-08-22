import {
  Injectable,
  TemplateRef,
  inject,
  signal,
  Injector
} from '@angular/core';
import { Dialog, DialogConfig, DialogRef } from '@angular/cdk/dialog';
import { ComponentType } from '@angular/cdk/portal';
import {
  TalosDialogConfig,
  TalosConfirmDialogOptions,
  TalosAlertDialogOptions,
  TALOS_DIALOG_DATA,
  TALOS_DIALOG_CONFIG,
  TALOS_DIALOG_REF
} from './dialog.types';
import { TalosDialogRef } from './dialog-ref';
import { TalosConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class TalosDialogService {
  private readonly cdkDialog = inject(Dialog);
  private readonly injector = inject(Injector);

  /** Signal of currently open dialog references */
  readonly openDialogs = signal<TalosDialogRef<unknown, unknown>[]>([]);

  /**
   * Open a component or template inside a modal dialog.
   */
  open<R = unknown, D = unknown>(
    componentOrTemplate: ComponentType<unknown> | TemplateRef<unknown>,
    config: TalosDialogConfig<D> = {}
  ): TalosDialogRef<R, D> {
    const size = config.size ?? 'md';
    const backdropBlur = config.backdropBlur ?? false;

    const panelClasses: string[] = ['talos-dialog-panel', `talos-dialog-size-${size}`];
    if (config.panelClass) {
      if (Array.isArray(config.panelClass)) {
        panelClasses.push(...config.panelClass);
      } else {
        panelClasses.push(config.panelClass);
      }
    }

    const backdropClasses: string[] = ['talos-dialog-backdrop'];
    if (backdropBlur === true || backdropBlur === 'md') {
      backdropClasses.push('talos-dialog-backdrop-blur-md');
    } else if (backdropBlur === 'sm') {
      backdropClasses.push('talos-dialog-backdrop-blur-sm');
    } else if (backdropBlur === 'lg') {
      backdropClasses.push('talos-dialog-backdrop-blur-lg');
    }

    if (config.backdropClass) {
      if (Array.isArray(config.backdropClass)) {
        backdropClasses.push(...config.backdropClass);
      } else {
        backdropClasses.push(config.backdropClass);
      }
    }

    const disableClose = config.disableClose ?? false;
    let talosRef: TalosDialogRef<R, D> | null = null;

    const cdkConfig: DialogConfig<D, DialogRef<R, unknown>> = {
      panelClass: panelClasses,
      backdropClass: backdropClasses,
      hasBackdrop: config.hasBackdrop ?? true,
      disableClose: disableClose,
      closeOnNavigation: true,
      autoFocus: config.autoFocus ?? 'first-tabbable',
      restoreFocus: config.restoreFocus ?? true,
      ariaLabel: config.ariaLabel,
      ariaLabelledBy: config.ariaLabelledBy,
      ariaDescribedBy: config.ariaDescribedBy,
      role: config.role ?? 'dialog',
      id: config.id,
      width: config.width,
      minWidth: config.minWidth,
      maxWidth: config.maxWidth,
      height: config.height,
      minHeight: config.minHeight,
      maxHeight: config.maxHeight,
      data: config.data,
      injector: this.injector,
      providers: (cdkDialogRef: DialogRef<R, unknown>) => {
        talosRef = new TalosDialogRef<R, D>(cdkDialogRef, config, config.data);
        return [
          { provide: TalosDialogRef, useValue: talosRef },
          { provide: TALOS_DIALOG_REF, useValue: talosRef },
          { provide: TALOS_DIALOG_DATA, useValue: config.data },
          { provide: TALOS_DIALOG_CONFIG, useValue: config }
        ];
      }
    };

    const cdkRef = this.cdkDialog.open<R, D, unknown>(componentOrTemplate, cdkConfig);
    if (!talosRef) {
      talosRef = new TalosDialogRef<R, D>(cdkRef, config, config.data);
    }
    const resolvedTalosRef = talosRef as TalosDialogRef<R, D>;

    // Track active dialogs
    this.openDialogs.update(current => [...current, resolvedTalosRef as TalosDialogRef<unknown, unknown>]);

    cdkRef.closed.subscribe(() => {
      this.openDialogs.update(current => current.filter(d => d.id !== resolvedTalosRef.id));
    });

    return resolvedTalosRef;
  }

  /**
   * Convenience helper to display a confirmation dialog.
   */
  confirm(options: TalosConfirmDialogOptions): TalosDialogRef<boolean> {
    return this.open<boolean, TalosConfirmDialogOptions>(TalosConfirmDialogComponent, {
      size: options.size ?? 'sm',
      backdropBlur: options.backdropBlur ?? true,
      disableClose: options.disableClose ?? false,
      role: 'alertdialog',
      data: options
    });
  }

  /**
   * Convenience helper to display an alert dialog.
   */
  alert(options: TalosAlertDialogOptions): TalosDialogRef<void> {
    return this.open<void, TalosConfirmDialogOptions>(TalosConfirmDialogComponent, {
      size: options.size ?? 'sm',
      backdropBlur: options.backdropBlur ?? true,
      role: 'alertdialog',
      data: {
        ...options,
        showCancel: false,
        confirmText: options.okText ?? 'OK'
      }
    });
  }

  /**
   * Close all currently open dialogs.
   */
  closeAll(): void {
    this.cdkDialog.closeAll();
  }
}
