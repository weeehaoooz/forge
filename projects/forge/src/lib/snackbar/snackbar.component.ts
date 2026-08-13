import {
  Component,
  TemplateRef,
  Type,
  computed,
  input,
  output,
  signal,
  OnDestroy,
  OnInit
} from '@angular/core';
import { NgComponentOutlet, NgTemplateOutlet } from '@angular/common';
import {
  LucideInfo,
  LucideCheckCircle2,
  LucideAlertTriangle,
  LucideCircleAlert,
  LucideX
} from '@lucide/angular';
import { ForgeSnackbarInstance } from './snackbar.types';

@Component({
  selector: 'forge-snackbar',
  imports: [
    NgComponentOutlet,
    NgTemplateOutlet,
    LucideInfo,
    LucideCheckCircle2,
    LucideAlertTriangle,
    LucideCircleAlert,
    LucideX
  ],
  templateUrl: './snackbar.component.html',
  styleUrl: './snackbar.component.scss'
})
export class ForgeSnackbarComponent implements OnInit, OnDestroy {
  /** Snackbar instance data */
  readonly instance = input.required<ForgeSnackbarInstance>();

  /** Event emitted when snackbar requests dismissal */
  readonly dismiss = output<string>();

  /** Event emitted when snackbar action button is clicked */
  readonly action = output<string>();

  protected readonly isDismissing = signal<boolean>(false);
  protected readonly progressPercent = signal<number>(100);
  protected readonly Infinity = Infinity;


  private timerId: ReturnType<typeof setInterval> | null = null;
  private remainingMs = 0;
  private lastTickMs = 0;

  readonly isTopPosition = computed(() => {
    const pos = this.instance().position;
    return pos ? pos.startsWith('top') : false;
  });

  readonly isTemplateMessage = computed(() => {
    return this.instance().message instanceof TemplateRef;
  });


  readonly templateMessage = computed(() => {
    return this.instance().message as TemplateRef<unknown>;
  });

  readonly customIconComponent = computed(() => {
    const icon = this.instance().icon;
    return typeof icon === 'function' ? (icon as Type<unknown>) : null;
  });

  readonly ariaRole = computed(() => {
    const variant = this.instance().variant;
    return variant === 'error' || variant === 'warning' ? 'alert' : 'status';
  });

  readonly ariaLive = computed(() => {
    const variant = this.instance().variant;
    return variant === 'error' || variant === 'warning' ? 'assertive' : 'polite';
  });

  ngOnInit(): void {
    const duration = this.instance().duration;
    if (duration > 0 && duration !== Infinity) {
      this.remainingMs = duration;
      this.startTimer();
    }
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  private startTimer(): void {
    this.stopTimer();
    const totalDuration = this.instance().duration;
    this.lastTickMs = Date.now();

    this.timerId = setInterval(() => {
      if (this.instance().isPaused) return;

      const now = Date.now();
      const delta = now - this.lastTickMs;
      this.lastTickMs = now;

      this.remainingMs -= delta;

      if (this.remainingMs <= 0) {
        this.progressPercent.set(0);
        this.stopTimer();
        this.onCloseClick();
      } else {
        const pct = Math.max(0, (this.remainingMs / totalDuration) * 100);
        this.progressPercent.set(pct);
      }
    }, 50);
  }

  private stopTimer(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  protected onMouseEnter(): void {
    if (this.instance().pauseOnHover) {
      this.instance().isPaused = true;
    }
  }

  protected onMouseLeave(): void {
    if (this.instance().pauseOnHover) {
      this.instance().isPaused = false;
      this.lastTickMs = Date.now();
    }
  }

  protected onActionClick(): void {
    if (this.instance().onAction) {
      this.instance().onAction!();
    }
    this.action.emit(this.instance().id);
    this.onCloseClick();
  }

  protected onCloseClick(): void {
    if (this.isDismissing()) return;
    this.isDismissing.set(true);

    if (this.instance().onDismiss) {
      this.instance().onDismiss!();
    }

    setTimeout(() => {
      this.dismiss.emit(this.instance().id);
    }, 200);
  }
}
