import { Component, inject, signal, computed, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  TalosDialogService,
  TalosDialogSize,
  TalosDialogBlur,
  TalosDialogModule
} from '@talos/components/dialog';
import { TalosButtonDirective } from '@talos/components/button';
import { TalosButtonGroupComponent, TalosButtonGroupItemDirective } from '@talos/components/button-group';
import { TalosSlideToggleComponent } from '@talos/components/form/slide-toggle';
import { TalosPreviewCodeCardComponent, DemoCodeTab } from '../../demo/preview-code-card/preview-code-card.component';
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
  LucideMaximize2,
  LucideFileCode2
} from '@lucide/angular';

import { UserEditDialogComponent } from './modals/user-edit-dialog.component';
import { LargeWorkflowDialogComponent } from './modals/large-workflow-dialog.component';
import { ContentHugDialogComponent } from './modals/content-hug-dialog.component';

export type PatternKey = 'userForm' | 'largeForm' | 'contentHug' | 'confirmAlert' | 'template';

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
    TalosPreviewCodeCardComponent,
    LucideSparkles,
    LucideTrash2,
    LucideAlertTriangle,
    LucideCheckCircle2,
    LucideSettings,
    LucideUserCheck,
    LucideMaximize2,
    LucideFileCode2
  ],
  templateUrl: './dialog-page.html',
  styleUrl: './dialog-page.scss'
})
export class DialogPage {
  private readonly dialog = inject(TalosDialogService);

  // Playground Configurator state
  protected readonly selectedSize = signal<TalosDialogSize>('md');
  protected readonly selectedBlur = signal<TalosDialogBlur>('md');
  protected readonly disableClose = signal<boolean>(false);
  protected readonly lastDialogResult = signal<string>('No dialog opened yet');

  // Unified Pattern Explorer state
  protected readonly selectedPattern = signal<PatternKey>('userForm');
  protected readonly patternViewMode = signal<'preview' | 'code'>('preview');

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

  /** Open Standard User Form Modal */
  protected openUserFormModal(): void {
    const ref = this.dialog.open(UserEditDialogComponent, {
      size: 'md',
      backdropBlur: this.selectedBlur(),
      data: {
        fullName: 'Eugene Lamar',
        email: 'eugene@glan.com',
        role: 'admin'
      }
    });

    ref.closed.subscribe(result => {
      if (result) {
        this.lastDialogResult.set(`User Profile Updated: ${JSON.stringify(result)}`);
      } else {
        this.lastDialogResult.set('User form closed');
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
      size: 'lg',
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

  /** Dynamic playground code */
  protected get playgroundCode(): string {
    const blurVal = typeof this.selectedBlur() === 'string' ? `'${this.selectedBlur()}'` : this.selectedBlur();
    return `import { Component, inject } from '@angular/core';
import { TalosDialogService } from '@talos/components/dialog';
import { UserEditDialogComponent } from './modals/user-edit-dialog.component';

@Component({
  selector: 'app-example',
  template: \`
    <button talosButton variant="primary" (click)="openDialog()">
      Launch Modal (${this.selectedSize()})
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
      data: {
        fullName: 'Eugene Lamar',
        email: 'eugene@glan.com',
        role: 'admin'
      }
    });

    ref.closed.subscribe(result => {
      if (result) {
        console.log('User saved:', result);
      }
    });
  }
}`;
  }

  /** Selected pattern metadata */
  protected readonly currentPatternInfo = computed(() => {
    switch (this.selectedPattern()) {
      case 'userForm':
        return {
          title: 'STANDARD FORM MODAL (size: "md")',
          subtitle: 'Clean modal for standard forms, profile editing, and validation with typed return payload.',
          badge: 'Form Pattern',
          tabs: this.userFormTabs
        };
      case 'largeForm':
        return {
          title: 'LARGE ENTERPRISE FORM (size: "lg" / "xl")',
          subtitle: 'Multi-column grid inputs with sticky action footer for complex infrastructure workflows.',
          badge: 'Enterprise Pattern',
          tabs: this.largeWorkflowTabs
        };
      case 'contentHug':
        return {
          title: 'DYNAMIC CONTENT-HUGGER (size: "auto")',
          subtitle: 'Modal dimensions tightly hug content and resize smoothly as dynamic elements change.',
          badge: 'Dynamic Sizing',
          tabs: this.contentHugTabs
        };
      case 'confirmAlert':
        return {
          title: '1-LINE CONFIRM & ALERT SHORTCUTS',
          subtitle: 'Built-in convenience methods for irreversible danger prompts and success notices.',
          badge: 'Convenience Helpers',
          tabs: this.confirmAlertTabs
        };
      case 'template':
        return {
          title: 'INLINE TEMPLATE MODAL (<ng-template>)',
          subtitle: 'Render dialogs directly from ng-template references without creating separate component files.',
          badge: 'Template Pattern',
          tabs: this.templateModalTabs
        };
    }
  });

  /* -------------------------------------------------------------
   * Code Snippet Tabs for Reusable Reference Cards
   * ------------------------------------------------------------- */
  protected readonly userFormTabs: DemoCodeTab[] = [
    {
      label: 'Caller Service Usage',
      code: `import { Component, inject } from '@angular/core';
import { TalosDialogService } from '@talos/components/dialog';
import { UserEditDialogComponent } from './modals/user-edit-dialog.component';

@Component({
  selector: 'app-users-view',
  template: \`
    <button talosButton variant="primary" (click)="editUser()">
      Edit User Profile
    </button>
  \`
})
export class UsersViewComponent {
  private readonly dialog = inject(TalosDialogService);

  editUser(): void {
    const ref = this.dialog.open(UserEditDialogComponent, {
      size: 'md',             // Standard form width (~560px)
      backdropBlur: 'md',     // Frosted glass background blur (8px)
      data: {
        fullName: 'Eugene Lamar',
        email: 'eugene@glan.com',
        role: 'admin'
      }
    });

    ref.closed.subscribe(updatedData => {
      if (updatedData) {
        console.log('Saved user payload:', updatedData);
      }
    });
  }
}`
    },
    {
      label: 'user-edit-dialog.component.ts',
      code: `import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import {
  TalosDialogModule,
  TalosDialogRef,
  TALOS_DIALOG_DATA
} from '@talos/components/dialog';
import { TalosButtonDirective } from '@talos/components/button';
import { TalosFormFieldComponent } from '@talos/components/form/form-field';
import { TalosInputDirective } from '@talos/components/form/input';
import { SelectInputComponent, OptionComponent } from '@talos/components/form/select-input';
import { TalosSlideToggleComponent } from '@talos/components/form/slide-toggle';
import { LucideUserCheck } from '@lucide/angular';

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
  template: \`
    <talos-dialog-header
      title="Edit Member Profile"
      subtitle="Update role permissions, email notification preferences, and team assignment.">
      <div talos-dialog-icon class="dialog-icon-badge">
        <svg lucideUserCheck [size]="20"></svg>
      </div>
    </talos-dialog-header>

    <talos-dialog-content padding="md">
      <form [formGroup]="form" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <talos-form-field label="Full Name" [required]="true">
            <input talosInput formControlName="fullName" placeholder="e.g. Eugene Lamar" />
          </talos-form-field>

          <talos-form-field label="Email Address" [required]="true">
            <input talosInput type="email" formControlName="email" placeholder="e.g. eugene@glan.com" />
          </talos-form-field>
        </div>

        <talos-form-field label="Workspace Role">
          <talos-select-input formControlName="role">
            <talos-option value="admin" label="Organization Admin" />
            <talos-option value="editor" label="Workflow Editor" />
            <talos-option value="viewer" label="Read-Only Viewer" />
          </talos-select-input>
        </talos-form-field>
      </form>
    </talos-dialog-content>

    <talos-dialog-footer align="end">
      <button talosButton variant="secondary" [talosDialogClose]="null">
        Cancel
      </button>
      <button talosButton variant="primary" [disabled]="form.invalid" (click)="save()">
        Save Changes
      </button>
    </talos-dialog-footer>
  \`
})
export class UserEditDialogComponent {
  private readonly dialogRef = inject(TalosDialogRef);
  private readonly initialData = inject(TALOS_DIALOG_DATA, { optional: true }) as any;

  protected readonly form = new FormGroup({
    fullName: new FormControl(this.initialData?.fullName ?? '', Validators.required),
    email: new FormControl(this.initialData?.email ?? '', [Validators.required, Validators.email]),
    role: new FormControl(this.initialData?.role ?? 'admin')
  });

  protected save(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}`
    }
  ];

  protected readonly largeWorkflowTabs: DemoCodeTab[] = [
    {
      label: 'Caller Service Usage',
      code: `import { Component, inject } from '@angular/core';
import { TalosDialogService } from '@talos/components/dialog';
import { LargeWorkflowDialogComponent } from './modals/large-workflow-dialog.component';

@Component({
  selector: 'app-deployment-view',
  template: \`
    <button talosButton variant="primary" (click)="openPipelineModal()">
      New Production Pipeline (Large Form)
    </button>
  \`
})
export class DeploymentViewComponent {
  private readonly dialog = inject(TalosDialogService);

  openPipelineModal(): void {
    const ref = this.dialog.open(LargeWorkflowDialogComponent, {
      size: 'lg',            // 'lg' (768px) or 'xl' (1024px) gives ample multi-column room
      backdropBlur: 'md',    // Frosted glass background
      disableClose: false
    });

    ref.closed.subscribe(config => {
      if (config) {
        console.log('Pipeline provisioned:', config);
      }
    });
  }
}`
    },
    {
      label: 'large-workflow-dialog.component.ts',
      code: `import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TalosDialogModule, TalosDialogRef } from '@talos/components/dialog';
import { TalosButtonDirective } from '@talos/components/button';
import { TalosFormFieldComponent } from '@talos/components/form/form-field';
import { TalosInputDirective } from '@talos/components/form/input';
import { SelectInputComponent, OptionComponent } from '@talos/components/form/select-input';
import { TalosChipsComponent, TalosChipComponent } from '@talos/components/form/chips';
import { TalosStatusTagComponent } from '@talos/components/status-tag';
import { LucideSettings } from '@lucide/angular';

@Component({
  selector: 'app-large-workflow-dialog',
  imports: [
    CommonModule,
    FormsModule,
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
  template: \`
    <talos-dialog-header
      title="Create Production Deployment Pipeline"
      subtitle="Configure multi-region deployment targets and limits.">
      <div talos-dialog-icon><svg lucideSettings [size]="20"></svg></div>
    </talos-dialog-header>

    <talos-dialog-content padding="lg">
      <!-- 3-Column and 4-Column Grid Inputs -->
      <div class="grid grid-cols-3 gap-4">
        <talos-form-field label="Pipeline Name" [required]="true">
          <input talosInput [(ngModel)]="pipelineName" />
        </talos-form-field>
        <talos-form-field label="Primary Region">
          <talos-select-input [(ngModel)]="region">
            <talos-option value="ap-southeast-1" label="Singapore" />
            <talos-option value="us-east-1" label="US East" />
          </talos-select-input>
        </talos-form-field>
        <talos-form-field label="Strategy">
          <talos-select-input [(ngModel)]="strategy">
            <talos-option value="blue-green" label="Blue/Green" />
            <talos-option value="canary" label="Canary" />
          </talos-select-input>
        </talos-form-field>
      </div>
    </talos-dialog-content>

    <talos-dialog-footer align="space-between" [sticky]="true">
      <talos-status-tag status="SUCCESS" label="Ready to provision" variant="subtle" size="sm" />
      <div class="flex gap-2">
        <button talosButton variant="secondary" [talosDialogClose]="null">Cancel</button>
        <button talosButton variant="primary" (click)="submit()">Provision Pipeline</button>
      </div>
    </talos-dialog-footer>
  \`
})
export class LargeWorkflowDialogComponent {
  private readonly dialogRef = inject(TalosDialogRef);
  protected pipelineName = 'prod-asia-01';
  protected region = 'ap-southeast-1';
  protected strategy = 'blue-green';

  submit(): void {
    this.dialogRef.close({ pipelineName: this.pipelineName, region: this.region });
  }
}`
    }
  ];

  protected readonly contentHugTabs: DemoCodeTab[] = [
    {
      label: 'Caller Service Usage',
      code: `import { Component, inject } from '@angular/core';
import { TalosDialogService } from '@talos/components/dialog';
import { ContentHugDialogComponent } from './modals/content-hug-dialog.component';

@Component({
  selector: 'app-dynamic-view',
  template: \`
    <button talosButton variant="outline" (click)="openHugModal()">
      Open Content-Hugging Modal (size: 'auto')
    </button>
  \`
})
export class DynamicViewComponent {
  private readonly dialog = inject(TalosDialogService);

  openHugModal(): void {
    // size: 'auto' tightly wraps content and smoothly resizes as children change
    this.dialog.open(ContentHugDialogComponent, {
      size: 'auto',
      backdropBlur: 'md'
    });
  }
}`
    },
    {
      label: 'content-hug-dialog.component.ts',
      code: `import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TalosDialogModule } from '@talos/components/dialog';
import { TalosButtonDirective } from '@talos/components/button';
import { TalosChipComponent } from '@talos/components/form/chips';
import { LucideSparkles, LucideFolderPlus } from '@lucide/angular';

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
  template: \`
    <talos-dialog-header
      title="Dynamic Content Hugger"
      subtitle="Modal dimensions hug content snugly and animate smoothly.">
      <div talos-dialog-icon><svg lucideSparkles [size]="20"></svg></div>
    </talos-dialog-header>

    <talos-dialog-content padding="md">
      <div class="flex flex-wrap gap-2 max-w-md">
        @for (tag of tags(); track tag) {
          <talos-chip [label]="tag" color="primary" [removable]="true" (removed)="removeTag(tag)" />
        }
      </div>
      <button talosButton variant="outline" size="sm" class="mt-4" (click)="addTag()">
        <svg lucideFolderPlus [size]="14"></svg> Add New Item
      </button>
    </talos-dialog-content>

    <talos-dialog-footer align="end">
      <button talosButton variant="primary" [talosDialogClose]="tags()">Done</button>
    </talos-dialog-footer>
  \`
})
export class ContentHugDialogComponent {
  protected readonly tags = signal<string[]>(['Redis Cache', 'Kafka Stream', 'Postgres Cluster']);
  private count = 1;

  addTag(): void {
    this.tags.update(t => [...t, \`Microservice #\${this.count++}\`]);
  }

  removeTag(tag: string): void {
    this.tags.update(t => t.filter(item => item !== tag));
  }
}`
    }
  ];

  protected readonly confirmAlertTabs: DemoCodeTab[] = [
    {
      label: 'dialog.confirm() & dialog.alert()',
      code: `import { Component, inject } from '@angular/core';
import { TalosDialogService } from '@talos/components/dialog';

@Component({
  selector: 'app-actions-demo',
  template: \`
    <button talosButton variant="danger" (click)="deleteDatabase()">
      Delete Database (Confirm)
    </button>

    <button talosButton variant="secondary" (click)="showAlert()">
      Show Success Notice (Alert)
    </button>
  \`
})
export class ActionsDemoComponent {
  private readonly dialog = inject(TalosDialogService);

  deleteDatabase(): void {
    this.dialog.confirm({
      title: 'Delete Production Database?',
      message: 'This action is irreversible. All table schemas and replica indices will be permanently deleted.',
      confirmText: 'Delete Database',
      cancelText: 'Cancel',
      variant: 'danger',
      backdropBlur: true
    }).closed.subscribe(confirmed => {
      if (confirmed) {
        console.log('Database deletion confirmed by user.');
      }
    });
  }

  showAlert(): void {
    this.dialog.alert({
      title: 'Deployment Completed Successfully',
      message: 'All 32 microservice containers have been verified and routed to live traffic.',
      okText: 'Understood',
      variant: 'success',
      backdropBlur: 'sm'
    });
  }
}`
    }
  ];

  protected readonly templateModalTabs: DemoCodeTab[] = [
    {
      label: 'Inline Template Modal',
      code: `import { Component, inject, TemplateRef } from '@angular/core';
import { TalosDialogService, TalosDialogModule } from '@talos/components/dialog';
import { TalosButtonDirective } from '@talos/components/button';

@Component({
  selector: 'app-template-dialog-demo',
  imports: [TalosDialogModule, TalosButtonDirective],
  template: \`
    <button talosButton variant="outline" (click)="openTemplate(myDialogTpl)">
      Open Template Dialog
    </button>

    <ng-template #myDialogTpl let-dialogRef>
      <talos-dialog-header title="Template-Driven Dialog" subtitle="Directly rendered from ng-template." />
      <talos-dialog-content padding="md">
        <p>No separate Angular component class required.</p>
      </talos-dialog-content>
      <talos-dialog-footer align="end">
        <button talosButton variant="primary" [talosDialogClose]="'completed'">
          Done
        </button>
      </talos-dialog-footer>
    </ng-template>
  \`
})
export class TemplateDialogDemoComponent {
  private readonly dialog = inject(TalosDialogService);

  openTemplate(tpl: TemplateRef<unknown>): void {
    this.dialog.open(tpl, {
      size: 'sm',
      backdropBlur: true
    });
  }
}`
    }
  ];
}
