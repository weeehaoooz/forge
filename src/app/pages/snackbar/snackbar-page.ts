import { Component, TemplateRef, ViewChild, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ForgeButtonDirective,
  ForgeInputDirective,
  ForgeSnackbarPosition,
  ForgeSnackbarService,
  ForgeSnackbarVariant
} from '@forge/components';

@Component({
  selector: 'app-snackbar-page',
  imports: [FormsModule, ForgeButtonDirective, ForgeInputDirective],
  templateUrl: './snackbar-page.html',
  styleUrl: './snackbar-page.scss'
})
export class SnackbarPage {
  private readonly snackbarService = inject(ForgeSnackbarService);

  @ViewChild('customTemplate') customTemplate!: TemplateRef<unknown>;

  // Interactive config state
  protected readonly messageText = signal<string>('Operation completed successfully!');
  protected readonly titleText = signal<string>('Notification');
  protected readonly selectedVariant = signal<ForgeSnackbarVariant>('success');
  protected readonly selectedPosition = signal<ForgeSnackbarPosition>('bottom-right');
  protected readonly durationMs = signal<number>(4000);
  protected readonly isDismissible = signal<boolean>(true);
  protected readonly showProgress = signal<boolean>(true);
  protected readonly actionText = signal<string>('Undo');

  protected readonly actionLog = signal<string[]>([]);

  showDefault(): void {
    this.snackbarService.show(this.messageText(), {
      title: this.titleText() || undefined,
      variant: this.selectedVariant(),
      position: this.selectedPosition(),
      duration: this.durationMs(),
      dismissible: this.isDismissible(),
      showProgressBar: this.showProgress(),
      actionLabel: this.actionText() || undefined,
      onAction: () => this.logAction('Action button clicked'),
      onDismiss: () => this.logAction('Snackbar dismissed')
    });
  }

  showSuccess(): void {
    this.snackbarService.success('Changes saved successfully!', {
      title: 'Success',
      position: this.selectedPosition(),
      duration: 3000
    });
  }

  showError(): void {
    this.snackbarService.error('Failed to connect to the server.', {
      title: 'Error',
      position: this.selectedPosition(),
      actionLabel: 'Retry',
      onAction: () => this.logAction('Retry triggered from error toast')
    });
  }

  showWarning(): void {
    this.snackbarService.warning('Your storage usage is at 90%.', {
      title: 'Warning',
      position: this.selectedPosition(),
      duration: 5000
    });
  }

  showInfo(): void {
    this.snackbarService.info('System maintenance scheduled for midnight.', {
      title: 'Information',
      position: this.selectedPosition()
    });
  }

  showCustomTemplate(): void {
    this.snackbarService.show(this.customTemplate, {
      position: this.selectedPosition(),
      duration: 6000,
      variant: 'default',
      data: { userName: 'Alex', itemsCount: 3 }
    });
  }

  showPersistent(): void {
    this.snackbarService.show('This notification stays until manually closed.', {
      title: 'Persistent Toast',
      variant: 'info',
      position: this.selectedPosition(),
      duration: 0,
      actionLabel: 'Dismiss All',
      onAction: () => this.dismissAll()
    });
  }

  dismissAll(): void {
    this.snackbarService.dismissAll();
    this.logAction('Dismissed all active snackbars');
  }

  private logAction(msg: string): void {
    const timestamp = new Date().toLocaleTimeString();
    this.actionLog.update((logs) => [`[${timestamp}] ${msg}`, ...logs.slice(0, 9)]);
  }
}
