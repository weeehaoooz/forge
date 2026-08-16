import { InjectionToken, TemplateRef } from '@angular/core';

/** Size options for the dialog modal */
export type TalosDialogSize = 'auto' | 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen';

/** Backdrop blur intensity options */
export type TalosDialogBlur = boolean | 'none' | 'sm' | 'md' | 'lg';

/** Visual variant for dialog styling and icons */
export type TalosDialogVariant = 'default' | 'primary' | 'danger' | 'warning' | 'info' | 'success';

/** Footer button alignment */
export type TalosDialogFooterAlign = 'start' | 'center' | 'end' | 'space-between';

/** Content padding variants */
export type TalosDialogPadding = 'none' | 'sm' | 'md' | 'lg';

/**
 * Configuration options for opening a Talos Dialog.
 */
export interface TalosDialogConfig<TData = unknown> {
  /** Sizing preset: 'auto' (content-hugging), 'sm' (420px), 'md' (560px), 'lg' (768px), 'xl' (1024px), or 'fullscreen' */
  size?: TalosDialogSize;

  /** Blur background effect: true/'md' (standard frosted glass), 'sm' (light blur), 'lg' (heavy blur), or false/'none' */
  backdropBlur?: TalosDialogBlur;

  /** Explicit width override (e.g. '500px', '75vw') */
  width?: string;

  /** Explicit min-width override */
  minWidth?: string;

  /** Explicit max-width override */
  maxWidth?: string;

  /** Explicit height override (e.g. '600px', '80vh') */
  height?: string;

  /** Explicit min-height override */
  minHeight?: string;

  /** Explicit max-height override */
  maxHeight?: string;

  /** Custom CSS classes to append to the dialog panel */
  panelClass?: string | string[];

  /** Custom CSS classes to append to the dialog backdrop */
  backdropClass?: string | string[];

  /** Whether the dialog has a backdrop overlay. Defaults to true. */
  hasBackdrop?: boolean;

  /** Whether the user can dismiss the dialog by clicking the backdrop or pressing ESC. Defaults to false. */
  disableClose?: boolean;

  /** Whether pressing ESC closes the dialog. Defaults to true unless disableClose is true. */
  closeOnEsc?: boolean;

  /** Whether clicking the backdrop closes the dialog. Defaults to true unless disableClose is true. */
  closeOnBackdropClick?: boolean;

  /** Arbitrary data passed to the dialog component via TALOS_DIALOG_DATA */
  data?: TData;

  /** Accessible label for the dialog */
  ariaLabel?: string;

  /** ID of the element that labels the dialog */
  ariaLabelledBy?: string;

  /** ID of the element that describes the dialog */
  ariaDescribedBy?: string;

  /** ARIA role for the dialog element ('dialog' or 'alertdialog') */
  role?: 'dialog' | 'alertdialog';

  /** Whether focus should automatically be trapped and moved to the first focusable element */
  autoFocus?: boolean | 'first-tabbable' | 'first-heading' | 'dialog';

  /** Whether focus should be restored to the triggering element upon closure */
  restoreFocus?: boolean;

  /** Custom ID for the dialog */
  id?: string;
}

/**
 * Options for the confirm dialog convenience method.
 */
export interface TalosConfirmDialogOptions {
  title: string;
  message: string | TemplateRef<unknown>;
  confirmText?: string;
  cancelText?: string;
  variant?: TalosDialogVariant;
  size?: TalosDialogSize;
  backdropBlur?: TalosDialogBlur;
  disableClose?: boolean;
  showCancel?: boolean;
  icon?: any;
}

/**
 * Options for the alert dialog convenience method.
 */
export interface TalosAlertDialogOptions {
  title: string;
  message: string | TemplateRef<unknown>;
  okText?: string;
  variant?: TalosDialogVariant;
  size?: TalosDialogSize;
  backdropBlur?: TalosDialogBlur;
  icon?: any;
}

/** Injection token for data passed to a dialog component */
export const TALOS_DIALOG_DATA = new InjectionToken<unknown>('TALOS_DIALOG_DATA');

/** Injection token for dialog configuration */
export const TALOS_DIALOG_CONFIG = new InjectionToken<TalosDialogConfig>('TALOS_DIALOG_CONFIG');

/** Injection token for dialog reference */
export const TALOS_DIALOG_REF = new InjectionToken<unknown>('TALOS_DIALOG_REF');
