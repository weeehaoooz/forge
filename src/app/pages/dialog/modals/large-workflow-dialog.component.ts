import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  TalosDialogModule,
  TalosDialogRef
} from '@talos/components/dialog';
import { TalosButtonDirective } from '@talos/components/button';
import { TalosFormFieldComponent } from '@talos/components/form/form-field';
import { TalosInputDirective } from '@talos/components/form/input';
import { SelectInputComponent, OptionComponent } from '@talos/components/form/select-input';
import { TalosChipsComponent, TalosChipComponent } from '@talos/components/form/chips';
import { TalosStatusTagComponent } from '../../../../../projects/talos/data-display/status-tag';
import { LucideSettings } from '@lucide/angular';

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
