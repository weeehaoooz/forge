import { Component, inject, signal, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import {
  TalosDialogService,
  TalosDialogSize,
  TalosDialogBlur,
  TalosDialogModule,
  TalosDialogRef,
  TALOS_DIALOG_DATA
} from '@talos/components/dialog';
import { TalosButtonDirective } from '@talos/components/button';
import { TalosButtonGroupComponent, TalosButtonGroupItemDirective } from '@talos/components/button-group';
import { TalosSlideToggleComponent } from '@talos/components/form/slide-toggle';
import { TalosInputDirective } from '@talos/components/form/input';
import { TalosFormFieldComponent } from '@talos/components/form/form-field';
import { SelectInputComponent, OptionComponent } from '@talos/components/form/select-input';
import { TalosStatusTagComponent } from '@talos/components/status-tag';
import { TalosChipsComponent, TalosChipComponent } from '@talos/components/form/chips';
import {
  LucideEye,
  LucideCode,
  LucideCopy,
  LucideCheck,
  LucideSparkles,
  LucideTrash2,
  LucideAlertTriangle,
  LucideCheckCircle2,
  LucideSettings,
  LucideUserCheck,
  LucideFolderPlus,
  LucideMaximize2
} from '@lucide/angular';

/* -------------------------------------------------------------
 * 1. Medium Form Component Modal
 * ------------------------------------------------------------- */
@Component({
  selector: 'app-user-edit-dialog',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TalosDialogModule,
    TalosButtonDirective,
    TalosFormFieldComponent,
    TalosInputDirective,
    SelectInputComponent,
    OptionComponent,
    TalosSlideToggleComponent,
    LucideUserCheck
  ],
  template: `
    <talos-dialog-header
      title="Edit Member Profile"
      subtitle="Update role permissions, email notification preferences, and team assignment.">
      <div talos-dialog-icon class="dialog-icon-badge">
        <svg lucideUserCheck [size]="20"></svg>
      </div>
    </talos-dialog-header>

    <talos-dialog-content padding="md">
      <form [formGroup]="form" class="dialog-form-layout">
        <div class="form-row-2">
          <talos-form-field label="Full Name" [required]="true">
            <input talosInput formControlName="fullName" placeholder="e.g. Eugene Lamar" />
          </talos-form-field>

          <talos-form-field label="Email Address" [required]="true">
            <input talosInput type="email" formControlName="email" placeholder="e.g. eugene@glan.com" />
          </talos-form-field>
        </div>

        <talos-form-field label="Workspace Role">
          <talos-select-input formControlName="role" placeholder="Select role">
            <talos-option value="admin" label="Organization Admin" />
            <talos-option value="editor" label="Workflow Editor" />
            <talos-option value="viewer" label="Read-Only Viewer" />
          </talos-select-input>
        </talos-form-field>

        <div class="form-toggle-row">
          <div>
            <span class="toggle-title">Security Alert Notifications</span>
            <p class="toggle-desc">Receive instant email digests when new security keys are generated.</p>
          </div>
          <talos-slide-toggle formControlName="notifications" />
        </div>
      </form>
    </talos-dialog-content>

    <talos-dialog-footer align="end">
      <button talosButton variant="secondary" size="md" [talosDialogClose]="null">
        Cancel
      </button>
      <button talosButton variant="primary" size="md" [disabled]="form.invalid" (click)="save()">
        Save Changes
      </button>
    </talos-dialog-footer>
  `,
  styles: [`
    .dialog-icon-badge {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2.25rem;
      height: 2.25rem;
      border-radius: 0.5rem;
      background: var(--talos-primary-light, #eff6ff);
      color: var(--talos-primary-color, #2563eb);
    }
    .dialog-form-layout {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    .form-row-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      @media (max-width: 600px) {
        grid-template-columns: 1fr;
      }
    }
    .form-toggle-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: 0.75rem 1rem;
      border-radius: var(--talos-border-radius, 0.375rem);
      background-color: var(--talos-bg-subtle, #f8fafc);
      border: 1px solid var(--talos-border-color, #e2e8f0);
    }
    .toggle-title {
      display: block;
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--talos-text-color, #0f172a);
    }
    .toggle-desc {
      margin: 0.125rem 0 0;
      font-size: 0.8125rem;
      color: var(--talos-text-muted, #64748b);
    }
  `]
})
export class UserEditDialogComponent {
  private readonly dialogRef = inject(TalosDialogRef);
  private readonly initialData = inject(TALOS_DIALOG_DATA, { optional: true }) as any;

  protected readonly form = new FormGroup({
    fullName: new FormControl(this.initialData?.fullName ?? 'Eugene Lamar', Validators.required),
    email: new FormControl(this.initialData?.email ?? 'eugene@glan.com', [Validators.required, Validators.email]),
    role: new FormControl(this.initialData?.role ?? 'admin'),
    notifications: new FormControl(this.initialData?.notifications ?? true)
  });

  protected save(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}

/* -------------------------------------------------------------
 * 2. Large / Multi-Column Enterprise Workflow Form Modal
 * ------------------------------------------------------------- */
@Component({
  selector: 'app-large-workflow-dialog',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TalosDialogModule,
    TalosButtonDirective,
    TalosFormFieldComponent,
    TalosInputDirective,
    SelectInputComponent,
    OptionComponent,
    TalosChipsComponent,
    TalosChipComponent,
    TalosStatusTagComponent,
    LucideSettings
  ],
  template: `
    <talos-dialog-header
      title="Create Production Deployment Pipeline"
      subtitle="Configure multi-region deployment target, autoscaling bounds, rollback thresholds, and secrets.">
      <div talos-dialog-icon class="dialog-icon-badge">
        <svg lucideSettings [size]="20"></svg>
      </div>
    </talos-dialog-header>

    <talos-dialog-content padding="lg">
      <form class="enterprise-form">
        <!-- Section 1: General Info -->
        <div class="form-section">
          <h3 class="section-heading">1. Pipeline & Cluster Environment</h3>
          <div class="grid-3">
            <talos-form-field label="Pipeline Identifier" [required]="true">
              <input talosInput [(ngModel)]="pipelineName" name="pName" placeholder="e.g. prod-asia-primary" />
            </talos-form-field>

            <talos-form-field label="Primary Cloud Region">
              <talos-select-input [(ngModel)]="region" name="region">
                <talos-option value="ap-southeast-1" label="Singapore (ap-southeast-1)" />
                <talos-option value="us-east-1" label="US East (us-east-1)" />
                <talos-option value="eu-central-1" label="Frankfurt (eu-central-1)" />
                <talos-option value="ap-northeast-1" label="Tokyo (ap-northeast-1)" />
              </talos-select-input>
            </talos-form-field>

            <talos-form-field label="Deployment Strategy">
              <talos-select-input [(ngModel)]="strategy" name="strategy">
                <talos-option value="blue-green" label="Blue / Green (Zero Downtime)" />
                <talos-option value="canary" label="Canary (10% Increment)" />
                <talos-option value="rolling" label="Rolling Update" />
              </talos-select-input>
            </talos-form-field>
          </div>
        </div>

        <!-- Section 2: Autoscaling & Resource Allocation -->
        <div class="form-section">
          <h3 class="section-heading">2. Resource Limits & Autoscaling Bounds</h3>
          <div class="grid-4">
            <talos-form-field label="Min Replicas">
              <input talosInput type="number" [(ngModel)]="minReplicas" name="minR" />
            </talos-form-field>

            <talos-form-field label="Max Replicas">
              <input talosInput type="number" [(ngModel)]="maxReplicas" name="maxR" />
            </talos-form-field>

            <talos-form-field label="CPU Limit (vCPU)">
              <input talosInput [(ngModel)]="cpuLimit" name="cpuL" placeholder="4000m" />
            </talos-form-field>

            <talos-form-field label="Memory Limit (GiB)">
              <input talosInput [(ngModel)]="memLimit" name="memL" placeholder="16Gi" />
            </talos-form-field>
          </div>
        </div>

        <!-- Section 3: Tags & Compliance -->
        <div class="form-section">
          <h3 class="section-heading">3. Environment Tags & Notification Webhook</h3>
          <div class="grid-2">
            <talos-form-field label="Notification Slack Webhook">
              <input talosInput [(ngModel)]="webhook" name="webhook" placeholder="https://hooks.slack.com/services/..." />
            </talos-form-field>

            <talos-form-field label="Environment Isolation Tier">
              <talos-select-input [(ngModel)]="tier" name="tier">
                <talos-option value="p0" label="P0 - Mission Critical SLA 99.99%" />
                <talos-option value="p1" label="P1 - Production Workload" />
                <talos-option value="p2" label="P2 - Staging / Preview" />
              </talos-select-input>
            </talos-form-field>
          </div>

          <div class="tags-group">
            <span class="tags-label">Assigned Compliance Labels:</span>
            <talos-chips>
              <talos-chip label="SOC2-Type2" color="primary" />
              <talos-chip label="HIPAA-Ready" color="success" />
              <talos-chip label="PCI-DSS" color="warning" />
              <talos-chip label="Auto-Encrypted" color="neutral" />
            </talos-chips>
          </div>
        </div>
      </form>
    </talos-dialog-content>

    <talos-dialog-footer align="space-between" [sticky]="true">
      <div class="footer-status">
        <talos-status-tag status="SUCCESS" label="Ready to provision" variant="subtle" size="sm" />
      </div>
      <div class="footer-actions">
        <button talosButton variant="secondary" size="md" [talosDialogClose]="null">
          Cancel
        </button>
        <button talosButton variant="primary" size="md" (click)="submit()">
          Provision Pipeline
        </button>
      </div>
    </talos-dialog-footer>
  `,
  styles: [`
    .dialog-icon-badge {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2.25rem;
      height: 2.25rem;
      border-radius: 0.5rem;
      background: var(--talos-primary-light, #eff6ff);
      color: var(--talos-primary-color, #2563eb);
    }
    .enterprise-form {
      display: flex;
      flex-direction: column;
      gap: 1.75rem;
    }
    .form-section {
      display: flex;
      flex-direction: column;
      gap: 0.875rem;
    }
    .section-heading {
      margin: 0;
      font-size: 0.875rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--talos-text-color, #0f172a);
    }
    .grid-3 {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }
    }
    .grid-4 {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
      @media (max-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }
    }
    .tags-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-top: 0.5rem;
    }
    .tags-label {
      font-size: 0.8125rem;
      font-weight: 500;
      color: var(--talos-text-muted, #64748b);
    }
    .footer-actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
  `]
})
export class LargeWorkflowDialogComponent {
  private readonly dialogRef = inject(TalosDialogRef);

  protected pipelineName = 'prod-asia-cluster-01';
  protected region = 'ap-southeast-1';
  protected strategy = 'blue-green';
  protected minReplicas = 4;
  protected maxReplicas = 32;
  protected cpuLimit = '4000m';
  protected memLimit = '16Gi';
  protected webhook = 'https://hooks.slack.com/services/T00/B00/XXXX';
  protected tier = 'p0';

  protected submit(): void {
    this.dialogRef.close({
      pipelineName: this.pipelineName,
      region: this.region,
      strategy: this.strategy
    });
  }
}

/* -------------------------------------------------------------
 * 3. Content-Based / Auto-Sizing Dynamic Modal Component
 * ------------------------------------------------------------- */
@Component({
  selector: 'app-content-hug-dialog',
  imports: [
    CommonModule,
    TalosDialogModule,
    TalosButtonDirective,
    TalosChipComponent,
    LucideSparkles,
    LucideFolderPlus
  ],
  template: `
    <talos-dialog-header
      title="Dynamic Content Hugger"
      subtitle="This dialog size is set to 'auto'. It hugs and expands seamlessly as items change.">
      <div talos-dialog-icon class="dialog-icon-badge">
        <svg lucideSparkles [size]="20"></svg>
      </div>
    </talos-dialog-header>

    <talos-dialog-content padding="md">
      <div class="content-hug-box">
        <p class="desc-text">
          Current active tags count: <strong>{{ tags().length }}</strong>
        </p>

        <div class="dynamic-chips-grid">
          @for (tag of tags(); track tag) {
            <talos-chip [label]="tag" color="primary" [removable]="true" (removed)="removeTag(tag)" />
          }
        </div>

        <div class="hug-action-bar">
          <button talosButton variant="outline" size="sm" (click)="addTag()">
            <svg lucideFolderPlus [size]="14"></svg>
            Add New Item
          </button>
        </div>
      </div>
    </talos-dialog-content>

    <talos-dialog-footer align="end">
      <button talosButton variant="primary" size="md" [talosDialogClose]="tags()">
        Done ({{ tags().length }} items)
      </button>
    </talos-dialog-footer>
  `,
  styles: [`
    .dialog-icon-badge {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2.25rem;
      height: 2.25rem;
      border-radius: 0.5rem;
      background: var(--talos-primary-light, #eff6ff);
      color: var(--talos-primary-color, #2563eb);
    }
    .content-hug-box {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .desc-text {
      margin: 0;
      font-size: 0.875rem;
      color: var(--talos-text-muted, #64748b);
    }
    .dynamic-chips-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      max-width: 440px;
    }
    .hug-action-bar {
      margin-top: 0.5rem;
    }
  `]
})
export class ContentHugDialogComponent {
  protected readonly tags = signal<string[]>([
    'High Availability',
    'Redis Cache',
    'Postgres Cluster',
    'Kafka Stream'
  ]);

  private count = 1;

  protected addTag(): void {
    this.tags.update(t => [...t, `Dynamic Microservice #${this.count++}`]);
  }

  protected removeTag(tag: string): void {
    this.tags.update(t => t.filter(item => item !== tag));
  }
}

/* -------------------------------------------------------------
 * Main Dialog Showcase Page Component
 * ------------------------------------------------------------- */
@Component({
  selector: 'app-dialog-page',
  imports: [
    CommonModule,
    FormsModule,
    TalosDialogModule,
    TalosButtonDirective,
    TalosButtonGroupComponent,
    TalosButtonGroupItemDirective,
    TalosSlideToggleComponent,
    LucideEye,
    LucideCode,
    LucideCopy,
    LucideCheck,
    LucideMaximize2,
    LucideSparkles,
    LucideTrash2,
    LucideAlertTriangle,
    LucideCheckCircle2,
    LucideSettings,
    LucideUserCheck
  ],
  templateUrl: './dialog-page.html',
  styleUrl: './dialog-page.scss'
})
export class DialogPage {
  private readonly dialog = inject(TalosDialogService);

  // Configurator state
  protected readonly activeTab = signal<'preview' | 'code'>('preview');
  protected readonly selectedSize = signal<TalosDialogSize>('md');
  protected readonly selectedBlur = signal<TalosDialogBlur>('md');
  protected readonly disableClose = signal<boolean>(false);
  protected readonly lastDialogResult = signal<string>('No dialog opened yet');

  // Icons
  protected readonly LucideEye = LucideEye;
  protected readonly LucideCode = LucideCode;
  protected readonly LucideCopy = LucideCopy;
  protected readonly LucideCheck = LucideCheck;
  protected readonly LucideSparkles = LucideSparkles;
  protected readonly LucideMaximize2 = LucideMaximize2;
  protected readonly LucideTrash2 = LucideTrash2;
  protected readonly LucideAlertTriangle = LucideAlertTriangle;

  // Code snippets copied indicator
  protected readonly copied = signal<boolean>(false);

  /** Open Configured Playground Dialog */
  protected openConfiguredModal(): void {
    const size = this.selectedSize();
    const blur = this.selectedBlur();

    if (size === 'auto') {
      this.openContentHugModal();
      return;
    }

    if (size === 'lg' || size === 'xl') {
      this.openLargeWorkflowModal();
      return;
    }

    const ref = this.dialog.open(UserEditDialogComponent, {
      size: size,
      backdropBlur: blur,
      disableClose: this.disableClose(),
      data: {
        fullName: 'Eugene Lamar',
        email: 'eugene@glan.com',
        role: 'admin'
      }
    });

    ref.closed.subscribe(result => {
      if (result) {
        this.lastDialogResult.set(`User Saved: ${JSON.stringify(result)}`);
      } else {
        this.lastDialogResult.set('Modal dismissed without changes');
      }
    });
  }

  /** Open 1-Line Confirm Dialog */
  protected openConfirmDialog(variant: 'primary' | 'danger' | 'warning' = 'primary'): void {
    const isDanger = variant === 'danger';
    const ref = this.dialog.confirm({
      title: isDanger ? 'Delete Production Database?' : 'Publish Architecture Changes?',
      message: isDanger
        ? 'This action is irreversible. All table schemas and replica indices will be permanently deleted.'
        : 'Publishing will immediately propagate your updated security configs and routes across all 8 global regions.',
      confirmText: isDanger ? 'Delete Database' : 'Publish Changes',
      cancelText: 'Cancel',
      variant: variant,
      backdropBlur: this.selectedBlur()
    });

    ref.closed.subscribe(confirmed => {
      this.lastDialogResult.set(`Confirm Result: ${confirmed ? 'Confirmed (true)' : 'Cancelled (false)'}`);
    });
  }

  /** Open 1-Line Alert Dialog */
  protected openAlertDialog(): void {
    const ref = this.dialog.alert({
      title: 'Deployment Completed Successfully',
      message: 'All 32 microservice containers have been successfully verified and routed to traffic.',
      okText: 'Understood',
      variant: 'success',
      backdropBlur: this.selectedBlur()
    });

    ref.closed.subscribe(() => {
      this.lastDialogResult.set('Alert dismissed');
    });
  }

  /** Open Content Hug / Auto Size Modal */
  protected openContentHugModal(): void {
    const ref = this.dialog.open(ContentHugDialogComponent, {
      size: 'auto',
      backdropBlur: this.selectedBlur(),
      disableClose: this.disableClose()
    });

    ref.closed.subscribe(result => {
      if (result) {
        this.lastDialogResult.set(`Content Hugger Result: ${JSON.stringify(result)}`);
      } else {
        this.lastDialogResult.set('Content Hugger dismissed');
      }
    });
  }

  /** Open Large / Enterprise Multi-column Form Modal */
  protected openLargeWorkflowModal(): void {
    const ref = this.dialog.open(LargeWorkflowDialogComponent, {
      size: this.selectedSize() === 'xl' ? 'xl' : 'lg',
      backdropBlur: this.selectedBlur(),
      disableClose: this.disableClose()
    });

    ref.closed.subscribe(result => {
      if (result) {
        this.lastDialogResult.set(`Pipeline Provisioned: ${JSON.stringify(result)}`);
      } else {
        this.lastDialogResult.set('Large form dismissed');
      }
    });
  }

  /** Open Fullscreen Modal */
  protected openFullscreenModal(): void {
    const ref = this.dialog.open(LargeWorkflowDialogComponent, {
      size: 'fullscreen',
      backdropBlur: this.selectedBlur(),
      disableClose: this.disableClose()
    });

    ref.closed.subscribe(result => {
      if (result) {
        this.lastDialogResult.set(`Fullscreen Form Submitted: ${JSON.stringify(result)}`);
      } else {
        this.lastDialogResult.set('Fullscreen Modal dismissed');
      }
    });
  }

  /** Open Template-Based Modal */
  protected openTemplateDialog(template: TemplateRef<unknown>): void {
    const ref = this.dialog.open(template, {
      size: 'sm',
      backdropBlur: this.selectedBlur()
    });

    ref.closed.subscribe(result => {
      this.lastDialogResult.set(`Template Modal Closed with: ${result ?? 'dismiss'}`);
    });
  }

  /** Copy Code Snippet */
  protected copyCode(): void {
    navigator.clipboard?.writeText(this.generatedCode);
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 2000);
  }

  protected get generatedCode(): string {
    const blurVal = typeof this.selectedBlur() === 'string' ? `'${this.selectedBlur()}'` : this.selectedBlur();
    return `import { Component, inject } from '@angular/core';
import { TalosDialogService } from '@talos/components/dialog';
import { UserEditDialogComponent } from './user-edit-dialog.component';

@Component({
  selector: 'app-example',
  template: \`
    <button talosButton variant="primary" (click)="openDialog()">
      Open Modal
    </button>
  \`
})
export class ExampleComponent {
  private readonly dialog = inject(TalosDialogService);

  openDialog(): void {
    const ref = this.dialog.open(UserEditDialogComponent, {
      size: '${this.selectedSize()}',
      backdropBlur: ${blurVal},
      disableClose: ${this.disableClose()},
      data: { userId: 123 }
    });

    ref.closed.subscribe(result => {
      if (result) {
        console.log('Dialog result:', result);
      }
    });
  }
}`;
  }
}
