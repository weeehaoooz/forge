import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  LucideCheckCircle2,
  LucideComponent,
  LucideLayers,
  LucideMousePointerClick,
  LucideRadio,
  LucideSparkles
} from '@lucide/angular';
import {
  TalosAlertAppearance,
  TalosAlertModule,
  TalosAlertService,
  TalosAlertSeverity,
  TalosAlertSize
} from '@talos/components/alert';
import { TalosButtonDirective } from '@talos/components/button';
import { TalosButtonGroupComponent, TalosButtonGroupItemDirective } from '@talos/components/button-group';
import { TalosDialogService } from '@talos/components/dialog';
import { TalosInputDirective } from '@talos/components/form/input';
import { TalosSlideToggleComponent } from '@talos/components/form/slide-toggle';
import { TalosSnackbarService } from '@talos/components/snackbar';
import { TalosPreviewCodeCardComponent } from '../../demo/preview-code-card/preview-code-card.component';

export type AlertPatternKey =
  | 'severityLevels'
  | 'simpleVsComplex'
  | 'appearances'
  | 'actionable'
  | 'serviceStack'
  | 'customSlots';

@Component({
  selector: 'app-alert-page',
  imports: [
    CommonModule,
    FormsModule,
    TalosAlertModule,
    TalosButtonDirective,
    TalosButtonGroupComponent,
    TalosButtonGroupItemDirective,
    TalosInputDirective,
    TalosSlideToggleComponent,
    TalosPreviewCodeCardComponent,
    LucideCheckCircle2,
    LucideComponent,
    LucideLayers,
    LucideMousePointerClick,
    LucideRadio,
    LucideSparkles
  ],
  templateUrl: './alert-page.html',
  styleUrl: './alert-page.scss'
})
export class AlertPage {
  readonly alertService = inject(TalosAlertService);
  private readonly snackbarService = inject(TalosSnackbarService);
  private readonly dialogService = inject(TalosDialogService);

  @ViewChild('customCardTemplate') customCardTemplate!: TemplateRef<unknown>;

  // Interactive Configurator Playground State
  protected readonly titleText = signal<string>('System Optimization');
  protected readonly messageText = signal<string>(
    'All backend services and replica clusters are operating normally with optimal response latency.'
  );
  protected readonly selectedSeverity = signal<TalosAlertSeverity>('success');
  protected readonly selectedAppearance = signal<TalosAlertAppearance>('subtle');
  protected readonly selectedSize = signal<TalosAlertSize>('md');
  protected readonly isDismissible = signal<boolean>(true);
  protected readonly showSeverityBadge = signal<boolean>(true);
  protected readonly showIcon = signal<boolean>(true);
  protected readonly isBordered = signal<boolean>(false);
  protected readonly actionText = signal<string>('View Status');

  // Unified Pattern Explorer State
  protected readonly selectedPattern = signal<AlertPatternKey>('severityLevels');
  protected readonly patternViewMode = signal<'preview' | 'code'>('preview');

  // Activity Log State
  protected readonly actionLog = signal<string[]>([]);

  // Code Snippet 1: The 4 Severity Levels
  protected readonly severityPatternHtml = `<!-- 1. SUCCESS (Default Severity) -->
<!-- Green theme with CheckCircle icon -->
<talos-alert
  severity="success"
  [showSeverityBadge]="true"
  title="Deployment Succeeded"
  message="Production deployment pipeline passed 142 integration tests and rolled out seamlessly."
  actionLabel="View Logs"
  [dismissible]="true"
/>

<!-- 2. INFO -->
<!-- Blue theme with Info icon -->
<talos-alert
  severity="info"
  [showSeverityBadge]="true"
  title="Scheduled Maintenance"
  message="Planned maintenance window is scheduled for Saturday 02:00 UTC. Zero downtime expected."
  actionLabel="Details"
  [dismissible]="true"
/>

<!-- 3. WARNING -->
<!-- Amber theme with AlertTriangle icon -->
<talos-alert
  severity="warning"
  [showSeverityBadge]="true"
  title="Storage Threshold Warning"
  message="Allocated PostgreSQL disk space is at 88% capacity. Auto-scaling threshold is 90%."
  actionLabel="Increase Quota"
  [dismissible]="true"
/>

<!-- 4. ERROR -->
<!-- Red theme with CircleAlert icon -->
<talos-alert
  severity="error"
  [showSeverityBadge]="true"
  title="Authentication Outage Detected"
  message="Primary auth cluster disconnected. Fallback tokens active in read-only mode."
  actionLabel="Failover"
  [dismissible]="true"
/>`;

  protected readonly severityPatternTs = `import { Component } from '@angular/core';
import { TalosAlertComponent } from '@talos/components/alert';

@Component({
  selector: 'app-severity-demo',
  imports: [TalosAlertComponent],
  templateUrl: './severity-demo.html'
})
export class SeverityDemo {}`;

  // Code Snippet 0: Simple 1-Line Alerts vs Complex Alerts
  protected readonly simpleVsComplexPatternHtml = `<!-- SIMPLE 1-LINE ALERTS (Defaults to Success Severity) -->
<talos-alert message="Profile changes saved successfully." />

<!-- Simple alert with explicit severity -->
<talos-alert severity="error" message="Database connection lost. Retrying in 5s..." />
<talos-alert severity="warning" message="Your quota limit is reaching 90%." />
<talos-alert severity="info" message="New feature release v0.2.0 available." />

<!-- COMPLEX CONTEXTUAL ALERT -->
<talos-alert
  severity="error"
  appearance="accent"
  [showSeverityBadge]="true"
  title="Payment Method Update Required"
  message="Your credit card ending in 4242 failed to process. Update billing to maintain active API endpoints."
  actionLabel="Update Billing"
  [dismissible]="true"
  (action)="onUpdateBilling()"
  (dismiss)="onAlertDismissed()"
/>`;

  protected readonly simpleVsComplexPatternTs = `import { Component, inject } from '@angular/core';
import { TalosAlertComponent, TalosAlertService } from '@talos/components/alert';

@Component({
  selector: 'app-alert-demo',
  imports: [TalosAlertComponent],
  templateUrl: './alert-demo.html'
})
export class AlertDemo {
  private readonly alert = inject(TalosAlertService);

  // Simple 1-line programmatic triggers for all 4 severities
  notifySuccess(): void {
    this.alert.success('Profile saved successfully!');
  }

  notifyInfo(): void {
    this.alert.info('Maintenance scheduled tonight at 02:00 UTC');
  }

  notifyWarning(): void {
    this.alert.warning('Your storage usage is at 88%');
  }

  notifyError(): void {
    this.alert.error('Primary auth node disconnected');
  }
}`;

  // Code Snippet 2: Appearances
  protected readonly appearancesPatternHtml = `<!-- Subtle Appearance (Default) -->
<talos-alert
  severity="info"
  appearance="subtle"
  title="Subtle Appearance"
  message="Ideal for embedded form notices and gentle feedback."
/>

<!-- Left Accent Border -->
<talos-alert
  severity="warning"
  appearance="accent"
  title="Accent Border Appearance"
  message="Clean surface with a bold colored left accent stripe."
/>

<!-- Outline -->
<talos-alert
  severity="success"
  appearance="outline"
  title="Outline Appearance"
  message="Transparent background with a colored border outline."
/>

<!-- Filled (High Impact) -->
<talos-alert
  severity="error"
  appearance="filled"
  title="Filled Appearance"
  message="High contrast solid background for critical announcements."
/>`;

  protected readonly appearancesPatternTs = `import { Component } from '@angular/core';
import { TalosAlertComponent } from '@talos/components/alert';

@Component({
  selector: 'app-appearances-demo',
  imports: [TalosAlertComponent],
  templateUrl: './appearances-demo.html'
})
export class AppearancesDemo {}`;

  // Code Snippet 3: Actionable
  protected readonly actionablePatternHtml = `<talos-alert
  severity="warning"
  appearance="accent"
  title="Unsaved Architectural Changes"
  message="You have unsaved route guards and security token policies."
  actionLabel="Save Now"
  [dismissible]="true"
  (action)="onSave()"
  (dismiss)="onDismiss()"
/>

<talos-alert
  severity="error"
  appearance="subtle"
  title="Payment Method Required"
  message="Your billing invoice has failed to process."
  actionLabel="Update Billing"
  [dismissible]="true"
  (action)="onUpdateBilling()"
/>`;

  protected readonly actionablePatternTs = `import { Component } from '@angular/core';
import { TalosAlertComponent } from '@talos/components/alert';

@Component({
  selector: 'app-actionable-demo',
  imports: [TalosAlertComponent],
  templateUrl: './actionable-demo.html'
})
export class ActionableDemo {
  onSave(): void {
    console.log('Saved changes');
  }

  onUpdateBilling(): void {
    console.log('Navigating to billing');
  }

  onDismiss(): void {
    console.log('Alert dismissed');
  }
}`;

  // Code Snippet 4: Service Stream
  protected readonly servicePatternHtml = `<button talosButton variant="primary" (click)="triggerSuccess()">
  Push Success
</button>
<button talosButton variant="danger" (click)="triggerError()">
  Push Error
</button>
<button talosButton variant="secondary" (click)="triggerWarning()">
  Push Warning
</button>
<button talosButton variant="outline" (click)="triggerInfo()">
  Push Info
</button>

<!-- Container rendering programmatic alerts -->
<talos-alert-container type="inline" />`;

  protected readonly servicePatternTs = `import { Component, inject } from '@angular/core';
import { TalosAlertContainerComponent, TalosAlertService } from '@talos/components/alert';
import { TalosButtonDirective } from '@talos/components/button';

@Component({
  selector: 'app-service-demo',
  imports: [TalosAlertContainerComponent, TalosButtonDirective],
  templateUrl: './service-demo.html'
})
export class ServiceDemo {
  private readonly alertService = inject(TalosAlertService);

  triggerSuccess(): void {
    this.alertService.success('Database migration completed!', {
      title: 'Migration Succeeded',
      actionLabel: 'View Logs'
    });
  }

  triggerError(): void {
    this.alertService.error('Authentication cluster degraded.', {
      title: 'Authentication Error',
      showSeverityBadge: true,
      actionLabel: 'Failover'
    });
  }
}`;

  // Code Snippet 5: Rich Slots
  protected readonly slotsPatternHtml = `<talos-alert severity="info" appearance="accent">
  <div talosAlertTitle class="custom-title-row">
    <span>🚀 Enterprise Feature Activated: Global Edge CDN</span>
    <span class="talos-alert-severity-badge" data-severity="info">NEW</span>
  </div>

  <div talosAlertDescription>
    <p>Your account has been upgraded to utilize anycast edge routing.</p>
    <ul>
      <li>Average TTFB reduced by 64%</li>
      <li>Zero-config HTTPS SSL termination</li>
    </ul>
  </div>

  <div talosAlertActions class="custom-actions-row">
    <button type="button" talosButton variant="primary" size="sm">
      Configure CDN
    </button>
  </div>
</talos-alert>`;

  protected readonly slotsPatternTs = `import { Component } from '@angular/core';
import {
  TalosAlertComponent,
  TalosAlertTitleDirective,
  TalosAlertDescriptionDirective,
  TalosAlertActionsDirective
} from '@talos/components/alert';
import { TalosButtonDirective } from '@talos/components/button';

@Component({
  selector: 'app-slots-demo',
  imports: [
    TalosAlertComponent,
    TalosAlertTitleDirective,
    TalosAlertDescriptionDirective,
    TalosAlertActionsDirective,
    TalosButtonDirective
  ],
  templateUrl: './slots-demo.html'
})
export class SlotsDemo {}`;

  // Dynamic Playground Code Generator
  protected readonly playgroundCode = computed<string>(() => {
    const sevAttr = `\n  severity="${this.selectedSeverity()}"`;
    const badgeAttr = this.showSeverityBadge() ? `\n  [showSeverityBadge]="true"` : '';
    const dismissAttr = this.isDismissible() ? `\n  [dismissible]="true"` : '';
    const actionAttr = this.actionText() ? `\n  actionLabel="${this.actionText()}"` : '';
    const borderedAttr = this.isBordered() ? `\n  [bordered]="true"` : '';

    return `<talos-alert${sevAttr}
  appearance="${this.selectedAppearance()}"
  size="${this.selectedSize()}"
  title="${this.titleText()}"
  message="${this.messageText()}"${actionAttr}${badgeAttr}${dismissAttr}${borderedAttr}
  (action)="onAlertAction()"
  (dismiss)="onAlertDismiss()"
/>`;
  });

  // Comparison & Demonstration Handlers
  triggerSnackbarDemo(): void {
    this.snackbarService.info('Background sync finished. Local changes synced with remote.', {
      title: 'Toast Notification',
      duration: 3500
    });
    this.logAction('Triggered Ephemeral Snackbar Toast (bottom-right overlay)');
  }

  triggerDialogAlertDemo(): void {
    this.dialogService.alert({
      title: 'Security Alert: Session Expired',
      message: 'Your authentication token has timed out. Please log in again to continue your session.',
      variant: 'danger',
      okText: 'Acknowledge'
    });
    this.logAction('Triggered Blocking Dialog Modal Alert');
  }

  // Preset Handlers for the 4 Severity States
  triggerSimpleAlert(): void {
    this.alertService.show('Simple 1-line alert triggered with default success severity.');
    this.logAction('Triggered 1-line Simple Alert via TalosAlertService.show()');
  }

  triggerSuccess(): void {
    this.alertService.success('Database migration completed with zero replica downtime.', {
      title: 'Migration Successful',
      showSeverityBadge: true,
      actionLabel: 'View Report',
      onAction: () => this.logAction('View Report clicked on Success alert')
    });
    this.logAction('Triggered Success severity alert');
  }

  triggerInfo(): void {
    this.alertService.info(
      'Maintenance window is scheduled for Saturday, 02:00 UTC. No service interruption expected.',
      {
        title: 'Scheduled Maintenance',
        showSeverityBadge: true,
        actionLabel: 'Details',
        onAction: () => this.logAction('Details clicked on Info alert')
      }
    );
    this.logAction('Triggered Info severity alert');
  }

  triggerWarning(): void {
    this.alertService.warning(
      'API rate limit reached 85% of tier allowance for the current billing cycle.',
      {
        title: 'Capacity Warning',
        showSeverityBadge: true,
        actionLabel: 'Upgrade Tier',
        onAction: () => this.logAction('Upgrade Tier clicked')
      }
    );
    this.logAction('Triggered Warning severity alert');
  }

  triggerError(): void {
    this.alertService.error(
      'Primary auth cluster disconnected. Fallback tokens active in read-only mode.',
      {
        title: 'Authentication Error',
        showSeverityBadge: true,
        actionLabel: 'Failover to Secondary',
        onAction: () => this.logAction('Failover triggered from Error alert')
      }
    );
    this.logAction('Triggered Error severity alert');
  }

  triggerBanner(): void {
    this.alertService.banner(
      'A new version of Talos UI (v0.2.0) is available with updated severity combinations!',
      {
        severity: 'info',
        actionLabel: 'Reload App',
        onAction: () => this.logAction('Reload App clicked on Global Banner')
      }
    );
    this.logAction('Triggered Global Banner alert');
  }

  dismissAll(): void {
    this.alertService.dismissAll();
    this.logAction('Dismissed all active programmatic alerts and banners');
  }

  onPlaygroundAction(): void {
    this.logAction(`Action clicked: "${this.actionText()}" on configured alert`);
  }

  onPlaygroundDismiss(): void {
    this.logAction('Configured alert dismissed');
  }

  dispatchPlaygroundAlert(): void {
    this.alertService.show({
      title: this.titleText() || undefined,
      message: this.messageText() || 'Alert message',
      severity: this.selectedSeverity(),
      appearance: this.selectedAppearance(),
      size: this.selectedSize(),
      showIcon: this.showIcon(),
      showSeverityBadge: this.showSeverityBadge(),
      dismissible: this.isDismissible(),
      bordered: this.isBordered(),
      actionLabel: this.actionText() || undefined,
      onAction: () => this.logAction(`Action clicked: "${this.actionText()}"`),
      onDismiss: () => this.logAction('Alert dismissed from stream')
    });
    this.logAction('Dispatched configured alert to active alert stream');
  }

  private logAction(message: string): void {
    const timestamp = new Date().toLocaleTimeString();
    this.actionLog.update((logs) => [`[${timestamp}] ${message}`, ...logs.slice(0, 11)]);
  }
}
