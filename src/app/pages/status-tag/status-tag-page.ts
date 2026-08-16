import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  TalosStatusTagComponent,
  TalosCanonicalWorkflowStatus,
  TalosStatusTagVariant,
  TalosStatusTagSize,
  TalosStatusTagShape,
  TalosButtonDirective,
  TalosButtonGroupComponent,
  TalosButtonGroupItemDirective,
  TalosSlideToggleComponent
} from '@talos/components';
import {
  LucideEye,
  LucideCode,
  LucideCopy,
  LucideCheck
} from '@lucide/angular';

interface WorkflowTask {
  id: string;
  name: string;
  workerNode: string;
  duration: string;
  status: TalosCanonicalWorkflowStatus;
  customLabel?: string;
  pulse?: boolean;
}

@Component({
  selector: 'app-status-tag-page',
  imports: [
    CommonModule,
    FormsModule,
    TalosStatusTagComponent,
    TalosButtonDirective,
    TalosButtonGroupComponent,
    TalosButtonGroupItemDirective,
    TalosSlideToggleComponent,
    LucideEye,
    LucideCode,
    LucideCopy,
    LucideCheck
  ],
  templateUrl: './status-tag-page.html',
  styleUrl: './status-tag-page.scss'
})
export class StatusTagPage {
  // Tab control: 'preview' | 'code'
  protected readonly activeTab = signal<'preview' | 'code'>('preview');
  protected readonly copied = signal<boolean>(false);

  // Status catalog
  protected readonly allStatuses: TalosCanonicalWorkflowStatus[] = [
    'NEW',
    'PENDING',
    'IN-PROGRESS',
    'PAUSED',
    'RETRYING',
    'SKIPPED',
    'SUCCESS',
    'COMPLETED',
    'ERROR',
    'TERMINATED',
    'EXPIRED'
  ];

  // Interactive Playground State
  protected readonly selectedStatus = signal<TalosCanonicalWorkflowStatus>('IN-PROGRESS');
  protected readonly selectedVariant = signal<TalosStatusTagVariant>('subtle');
  protected readonly selectedSize = signal<TalosStatusTagSize>('md');
  protected readonly selectedShape = signal<TalosStatusTagShape>('rounded');
  protected readonly showIcon = signal<boolean>(true);
  protected readonly iconOnly = signal<boolean>(false);
  protected readonly pulse = signal<boolean>(true);
  protected readonly customLabel = signal<string>('');

  // Interactive Color Override Playground
  protected readonly activeThemeOverride = signal<'default' | 'vibrant' | 'monochrome' | 'neon'>('default');
  protected readonly customInprogressColor = signal<string>('#6366f1');
  protected readonly customInprogressBg = signal<string>('#eef2ff');

  // Workflow Pipeline Tasks Demo
  protected readonly pipelineTasks = signal<WorkflowTask[]>([
    {
      id: 'TASK-101',
      name: 'Validate Schema & Payload Constraints',
      workerNode: 'node-us-east-1a',
      duration: '142ms',
      status: 'SUCCESS'
    },
    {
      id: 'TASK-102',
      name: 'Fetch External Partition Data (S3 Bucket)',
      workerNode: 'node-us-east-1b',
      duration: '1.82s',
      status: 'COMPLETED'
    },
    {
      id: 'TASK-103',
      name: 'Distributed GPU Inference Model Execution',
      workerNode: 'gpu-cluster-a100-04',
      duration: '45.2s',
      status: 'IN-PROGRESS',
      pulse: true
    },
    {
      id: 'TASK-104',
      name: 'Upstream Webhook Notification Hook',
      workerNode: 'node-us-west-2a',
      duration: '3.4s',
      status: 'RETRYING',
      customLabel: 'Attempt 2 of 5',
      pulse: true
    },
    {
      id: 'TASK-105',
      name: 'Compliance & Safety Audit Sign-off',
      workerNode: 'manual-gate-worker',
      duration: 'waiting',
      status: 'PAUSED',
      customLabel: 'Awaiting Review'
    },
    {
      id: 'TASK-106',
      name: 'Optional Data Lake Archival Sync',
      workerNode: 'batch-worker-09',
      duration: '0ms',
      status: 'SKIPPED'
    },
    {
      id: 'TASK-107',
      name: 'Post-Process PDF Report Generation',
      workerNode: 'worker-node-12',
      duration: '0s',
      status: 'PENDING'
    },
    {
      id: 'TASK-108',
      name: 'Legacy Notification Subsystem Sync',
      workerNode: 'legacy-adapter',
      duration: '30.0s',
      status: 'EXPIRED'
    }
  ]);

  protected readonly codeSnippet = computed(() => {
    const status = this.selectedStatus();
    const variant = this.selectedVariant();
    const size = this.selectedSize();
    const shape = this.selectedShape();
    const icon = this.showIcon();
    const iconOnly = this.iconOnly();
    const pulse = this.pulse();
    const label = this.customLabel();

    const parts: string[] = [`<talos-status-tag status="${status}"`];

    if (variant !== 'subtle') parts.push(`variant="${variant}"`);
    if (size !== 'md') parts.push(`size="${size}"`);
    if (shape !== 'rounded') parts.push(`shape="${shape}"`);
    if (!icon) parts.push(`[showIcon]="false"`);
    if (iconOnly) parts.push(`[iconOnly]="true"`);
    if (pulse) parts.push(`[pulse]="true"`);
    if (label && label.trim().length > 0) parts.push(`label="${label}"`);

    parts.push(`/>`);
    return parts.join(' ');
  });

  protected copyCode(): void {
    navigator.clipboard.writeText(this.codeSnippet());
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 2000);
  }
}
