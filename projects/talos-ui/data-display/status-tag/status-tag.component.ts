import {
  Component,
  ElementRef,
  Type,
  computed,
  inject,
  input
} from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import {
  LucideSparkles,
  LucideClock,
  LucideLoader2,
  LucideCirclePause,
  LucideRotateCcw,
  LucideFastForward,
  LucideCheckCircle2,
  LucideCheckCheck,
  LucideCircleAlert,
  LucideBan,
  LucideClockAlert
} from '@lucide/angular';
import {
  TALOS_STATUS_DESCRIPTORS,
  TalosCanonicalWorkflowStatus,
  TalosStatusDescriptor,
  TalosStatusTagShape,
  TalosStatusTagSize,
  TalosStatusTagVariant,
  TalosWorkflowStatus,
  normalizeWorkflowStatus
} from './status-tag.types';

@Component({
  selector: 'talos-status-tag, [talosStatusTag]',
  imports: [NgComponentOutlet],
  templateUrl: './status-tag.component.html',
  styleUrl: './status-tag.component.scss',
  host: {
    'class': 'talos-status-tag',
    '[class.talos-status-tag--new]': 'canonicalStatus() === "NEW"',
    '[class.talos-status-tag--pending]': 'canonicalStatus() === "PENDING"',
    '[class.talos-status-tag--inprogress]': 'canonicalStatus() === "IN-PROGRESS"',
    '[class.talos-status-tag--paused]': 'canonicalStatus() === "PAUSED"',
    '[class.talos-status-tag--retrying]': 'canonicalStatus() === "RETRYING"',
    '[class.talos-status-tag--skipped]': 'canonicalStatus() === "SKIPPED"',
    '[class.talos-status-tag--success]': 'canonicalStatus() === "SUCCESS"',
    '[class.talos-status-tag--completed]': 'canonicalStatus() === "COMPLETED"',
    '[class.talos-status-tag--error]': 'canonicalStatus() === "ERROR"',
    '[class.talos-status-tag--terminated]': 'canonicalStatus() === "TERMINATED"',
    '[class.talos-status-tag--expired]': 'canonicalStatus() === "EXPIRED"',
    '[class.talos-status-tag--subtle]': 'variant() === "subtle"',
    '[class.talos-status-tag--solid]': 'variant() === "solid"',
    '[class.talos-status-tag--outline]': 'variant() === "outline"',
    '[class.talos-status-tag--dot]': 'variant() === "dot"',
    '[class.talos-status-tag--xs]': 'size() === "xs"',
    '[class.talos-status-tag--sm]': 'size() === "sm"',
    '[class.talos-status-tag--md]': 'size() === "md"',
    '[class.talos-status-tag--lg]': 'size() === "lg"',
    '[class.talos-status-tag--rounded]': 'shape() === "rounded"',
    '[class.talos-status-tag--pill]': 'shape() === "pill"',
    '[class.talos-status-tag--square]': 'shape() === "square"',
    '[class.talos-status-tag--pulse]': 'pulse()',
    '[class.talos-status-tag--icon-only]': 'iconOnly()',
    '[attr.role]': '"status"',
    '[attr.aria-label]': 'resolvedAriaLabel()'
  }
})
export class TalosStatusTagComponent {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  /**
   * The workflow status to display. Supports all canonical names, lowercase variants, and common aliases.
   */
  readonly status = input.required<TalosWorkflowStatus | string>();

  /**
   * Optional custom label text. If not provided or empty, defaults to standard status label.
   */
  readonly label = input<string | null | undefined>(undefined);

  /**
   * Visual presentation style.
   * @default 'subtle'
   */
  readonly variant = input<TalosStatusTagVariant>('subtle');

  /**
   * Size scale.
   * @default 'md'
   */
  readonly size = input<TalosStatusTagSize>('md');

  /**
   * Border radius shape.
   * @default 'rounded'
   */
  readonly shape = input<TalosStatusTagShape>('rounded');

  /**
   * Whether to render the status icon / indicator symbol.
   * @default true
   */
  readonly showIcon = input<boolean>(true);

  /**
   * Optional custom icon component override.
   */
  readonly icon = input<Type<unknown> | null>(null);

  /**
   * Whether to render only the symbol/icon without label text.
   * @default false
   */
  readonly iconOnly = input<boolean>(false);

  /**
   * Whether to enable pulsing animation for active/waiting states.
   * @default false
   */
  readonly pulse = input<boolean>(false);

  /**
   * Optional accessible ARIA label override.
   */
  readonly ariaLabel = input<string | null | undefined>(undefined);

  /**
   * Normalized canonical workflow status.
   */
  readonly canonicalStatus = computed<TalosCanonicalWorkflowStatus>(() => {
    return normalizeWorkflowStatus(this.status());
  });

  /**
   * Descriptor containing default metadata for current canonical status.
   */
  readonly descriptor = computed<TalosStatusDescriptor>(() => {
    return TALOS_STATUS_DESCRIPTORS[this.canonicalStatus()];
  });

  /**
   * Resolved label to display when no custom content is projected.
   */
  readonly resolvedLabel = computed<string>(() => {
    const customLabel = this.label();
    if (customLabel !== undefined && customLabel !== null && customLabel.trim().length > 0) {
      return customLabel;
    }
    return this.descriptor().defaultLabel;
  });

  /**
   * Resolved accessibility label for screen readers.
   */
  readonly resolvedAriaLabel = computed<string>(() => {
    const customAria = this.ariaLabel();
    if (customAria !== undefined && customAria !== null && customAria.trim().length > 0) {
      return customAria;
    }
    return `${this.descriptor().defaultAriaLabel}: ${this.resolvedLabel()}`;
  });

  /**
   * Pixel size for the Lucide icon based on status tag size.
   */
  readonly iconSize = computed<number>(() => {
    switch (this.size()) {
      case 'xs':
        return 11;
      case 'sm':
        return 13;
      case 'lg':
        return 16;
      case 'md':
      default:
        return 14;
    }
  });

  /**
   * Resolved default Lucide icon component for the current canonical status.
   */
  readonly defaultIconComponent = computed<Type<unknown>>(() => {
    switch (this.canonicalStatus()) {
      case 'NEW':
        return LucideSparkles;
      case 'PENDING':
        return LucideClock;
      case 'IN-PROGRESS':
        return LucideLoader2;
      case 'PAUSED':
        return LucideCirclePause;
      case 'RETRYING':
        return LucideRotateCcw;
      case 'SKIPPED':
        return LucideFastForward;
      case 'SUCCESS':
        return LucideCheckCircle2;
      case 'COMPLETED':
        return LucideCheckCheck;
      case 'ERROR':
        return LucideCircleAlert;
      case 'TERMINATED':
        return LucideBan;
      case 'EXPIRED':
        return LucideClockAlert;
      default:
        return LucideClock;
    }
  });

  /**
   * Active icon component to render (custom icon if provided, otherwise default semantic icon).
   */
  readonly activeIconComponent = computed<Type<unknown>>(() => {
    return this.icon() ?? this.defaultIconComponent();
  });

  /**
   * Whether the icon should have active spin/rotation animation (e.g. IN-PROGRESS, RETRYING).
   */
  readonly shouldAnimateIcon = computed<boolean>(() => {
    return !!this.descriptor().shouldAnimateIcon;
  });
}
