import { TemplateRef, Type } from '@angular/core';

export type TalosAlertVariant =
  | 'default'
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'primary'
  | 'critical';

export type TalosAlertSeverity = 'success' | 'info' | 'warning' | 'error';

export type TalosAlertAppearance =
  | 'subtle'
  | 'outline'
  | 'filled'
  | 'accent'
  | 'left-border';

export type TalosAlertSize = 'sm' | 'md' | 'lg';

export interface TalosAlertConfig {
  /** Optional unique identifier */
  id?: string;
  /** Title header text or custom TemplateRef */
  title?: string | TemplateRef<unknown>;
  /** Main message content or custom TemplateRef */
  message?: string | TemplateRef<unknown>;
  /** Visual variant theme */
  variant?: TalosAlertVariant;
  /** Severity state: 'success' (default), 'info', 'warning', 'error' */
  severity?: TalosAlertSeverity;
  /** Visual surface appearance style */
  appearance?: TalosAlertAppearance;
  /** Alert sizing */
  size?: TalosAlertSize;
  /** Whether to show an icon. Default: true */
  showIcon?: boolean;
  /** Custom Lucide icon component, TemplateRef, or null/false to hide */
  icon?: Type<unknown> | TemplateRef<unknown> | boolean | null;
  /** Whether to display a severity badge. Default: false */
  showSeverityBadge?: boolean;
  /** Whether the alert can be closed by the user. Default: false for inline, true for service */
  dismissible?: boolean;
  /** Action button text label (e.g., 'Retry', 'View Logs') */
  actionLabel?: string;
  /** Callback triggered when action button is clicked */
  onAction?: () => void;
  /** Callback triggered when alert is dismissed */
  onDismiss?: () => void;
  /** Custom CSS class to attach to the alert container */
  customClass?: string;
  /** Explicit border outline. Default: false */
  bordered?: boolean;
  /** Auto-dismiss duration in milliseconds */
  duration?: number;
  /** Arbitrary metadata attached to the instance */
  data?: unknown;
}

export interface TalosAlertRef {
  id: string;
  dismiss: () => void;
}

export interface TalosAlertInstance extends TalosAlertConfig {
  id: string;
  createdAt: number;
}
