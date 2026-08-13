import { TemplateRef, Type } from '@angular/core';

export type ForgeSnackbarVariant = 'default' | 'info' | 'success' | 'warning' | 'error';

export type ForgeSnackbarPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export interface ForgeSnackbarConfig {
  /** Title text shown above message */
  title?: string;
  /** Main message text or custom Angular TemplateRef */
  message: string | TemplateRef<unknown>;
  /** Visual variant theme */
  variant?: ForgeSnackbarVariant;
  /** Screen position placement */
  position?: ForgeSnackbarPosition;
  /** Auto-dismiss duration in milliseconds. 0 or Infinity for persistent. Default: 4000ms */
  duration?: number;
  /** Whether to show a close button ('X'). Default: true */
  dismissible?: boolean;
  /** Text label for an action button (e.g., 'Undo', 'Retry') */
  actionLabel?: string;
  /** Callback fired when action button is clicked */
  onAction?: () => void;
  /** Callback fired when snackbar is dismissed */
  onDismiss?: () => void;
  /** Custom CSS class name to append to the snackbar element */
  customClass?: string;
  /** Whether to display a timer progress bar at the bottom. Default: true */
  showProgressBar?: boolean;
  /** Whether mouse hover pauses auto-dismiss countdown. Default: true */
  pauseOnHover?: boolean;
  /** Custom Lucide icon component or null/false to hide icon */
  icon?: Type<unknown> | null | boolean;
  /** Optional custom data context when using TemplateRef */
  data?: unknown;
}

export interface ForgeSnackbarRef {
  /** Unique ID of the snackbar instance */
  readonly id: string;
  /** Programmatically dismiss this snackbar */
  dismiss: () => void;
}

export interface ForgeSnackbarInstance extends Required<Omit<ForgeSnackbarConfig, 'title' | 'actionLabel' | 'onAction' | 'onDismiss' | 'customClass' | 'icon' | 'data'>> {
  id: string;
  title?: string;
  actionLabel?: string;
  onAction?: () => void;
  onDismiss?: () => void;
  customClass?: string;
  icon?: Type<unknown> | null | boolean;
  data?: unknown;
  createdAt: number;
  isPaused: boolean;
}
