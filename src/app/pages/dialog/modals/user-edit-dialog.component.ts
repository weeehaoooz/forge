import { Component, inject } from '@angular/core';
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

export interface UserEditDialogData {
  fullName?: string;
  email?: string;
  role?: string;
  notifications?: boolean;
}

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
  private readonly initialData = inject<UserEditDialogData | null>(TALOS_DIALOG_DATA, { optional: true });

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
