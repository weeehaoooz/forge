import { Component, computed, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  TalosDropZoneComponent,
  TalosFileDropDirective,
  TalosButtonDirective,
  TalosButtonGroupComponent,
  TalosButtonGroupItemDirective,
  TalosSlideToggleComponent,
  DropZoneFile,
  DropZoneRejection,
  DropZoneSize,
  DropZoneVariant
} from '@talos/components';
import {
  LucideEye,
  LucideCode,
  LucideCopy,
  LucideCheck,
  LucideUpload,
  LucideFileText,
  LucideRotateCcw,
  LucideBan,
  LucideShieldAlert,
  LucideFolderArchive
} from '@lucide/angular';

@Component({
  selector: 'app-drop-zone-page',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TalosDropZoneComponent,
    TalosFileDropDirective,
    TalosButtonDirective,
    TalosButtonGroupComponent,
    TalosButtonGroupItemDirective,
    TalosSlideToggleComponent,
    LucideEye,
    LucideCode,
    LucideCopy,
    LucideCheck,
    LucideUpload,
    LucideFileText,
    LucideRotateCcw,
    LucideBan,
    LucideShieldAlert,
    LucideFolderArchive
  ],
  templateUrl: './drop-zone-page.html',
  styleUrl: './drop-zone-page.scss'
})
export class DropZonePage {
  @ViewChild('simulatedDropZone') simulatedDropZone?: TalosDropZoneComponent;

  // Active tab: 'preview' | 'code'
  protected readonly activeTab = signal<'preview' | 'code'>('preview');
  protected readonly copied = signal<boolean>(false);

  // --- Playground Configurator State ---
  protected readonly selectedSize = signal<DropZoneSize>('md');
  protected readonly selectedVariant = signal<DropZoneVariant>('default');
  protected readonly isMultiple = signal<boolean>(true);
  protected readonly isDisabled = signal<boolean>(false);
  protected readonly isReadonly = signal<boolean>(false);
  protected readonly isLoading = signal<boolean>(false);
  protected readonly showFileList = signal<boolean>(true);
  protected readonly maxFiles = signal<number | null>(5);
  protected readonly maxFileSizeStr = signal<string>('25MB');
  protected readonly acceptStr = signal<string>('image/*,.pdf,.docx,.xlsx');
  protected readonly customTitle = signal<string>('Choose a file or drag & drop it here');
  protected readonly customSubtitle = signal<string>('JPEG, PNG, PDF, and DOC formats, up to 25 MB');

  // Playground Staged Files
  protected readonly playgroundFiles = signal<DropZoneFile[]>([]);
  protected readonly playgroundRejections = signal<DropZoneRejection[]>([]);

  // Simulated Async Uploading Example
  protected readonly isSimulatingUpload = signal<boolean>(false);
  protected readonly simulatedFiles = signal<DropZoneFile[]>([]);
  protected readonly lastRejections = signal<DropZoneRejection[]>([]);

  // Avatar Image Upload
  protected readonly avatarFile = signal<DropZoneFile[]>([]);

  // Document Upload
  protected readonly documentFiles = signal<DropZoneFile[]>([]);

  // Custom Container Directive Drop Target
  protected readonly customDroppedFiles = signal<File[]>([]);
  protected readonly isCustomDragOver = signal<boolean>(false);

  // Reactive Forms Integration
  readonly uploadForm = new FormGroup({
    attachments: new FormControl<DropZoneFile[]>([], [Validators.required]),
    projectSpec: new FormControl<DropZoneFile[]>([], [Validators.required])
  });

  // Simulated async upload runner
  onSimulatedFilesChange(files: DropZoneFile[]): void {
    this.simulatedFiles.set(files);

    // Automatically trigger upload progress for any pending files
    for (const f of files) {
      if (f.status === 'pending') {
        this.runSimulatedUpload(f.id);
      }
    }
  }

  onSimulatedRetry(file: DropZoneFile): void {
    this.runSimulatedUpload(file.id);
  }

  private runSimulatedUpload(fileId: string): void {
    if (!this.simulatedDropZone) return;

    let progress = 0;
    this.simulatedDropZone.updateFileProgress(fileId, 0, 'uploading');

    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 20) + 15;
      if (progress >= 100) {
        clearInterval(interval);
        // Occasionally simulate a failure for demonstration if file name contains "error" or randomly
        const currentFile = this.simulatedFiles().find((f) => f.id === fileId);
        const shouldFail = currentFile?.name.toLowerCase().includes('error');

        if (shouldFail) {
          this.simulatedDropZone?.updateFileProgress(fileId, 75, 'error', 'Network timeout during upload. Please retry.');
        } else {
          this.simulatedDropZone?.updateFileProgress(fileId, 100, 'success');
        }
      } else {
        this.simulatedDropZone?.updateFileProgress(fileId, progress, 'uploading');
      }
    }, 280);
  }

  onRejections(rejections: DropZoneRejection[]): void {
    this.lastRejections.set(rejections);
    setTimeout(() => {
      this.lastRejections.set([]);
    }, 6000);
  }

  onPlaygroundRejections(rejections: DropZoneRejection[]): void {
    this.playgroundRejections.set(rejections);
    setTimeout(() => {
      this.playgroundRejections.set([]);
    }, 6000);
  }

  onCustomDrop(files: File[]): void {
    this.customDroppedFiles.set(files);
  }

  // Reactive Forms Actions
  submitForm(): void {
    if (this.uploadForm.valid) {
      alert(`Form Submitted Successfully! Attachments: ${this.uploadForm.value.attachments?.length} files`);
    } else {
      this.uploadForm.markAllAsTouched();
    }
  }

  resetForm(): void {
    this.uploadForm.reset({
      attachments: [],
      projectSpec: []
    });
  }

  toggleFormDisabled(): void {
    if (this.uploadForm.disabled) {
      this.uploadForm.enable();
    } else {
      this.uploadForm.disable();
    }
  }

  // Code Snippet Generator for Playground
  protected readonly codeSnippet = computed(() => {
    const size = this.selectedSize();
    const variant = this.selectedVariant();
    const multiple = this.isMultiple();
    const disabled = this.isDisabled();
    const readonly = this.isReadonly();
    const loading = this.isLoading();
    const maxFiles = this.maxFiles();
    const maxFileSize = this.maxFileSizeStr();
    const accept = this.acceptStr();
    const title = this.customTitle();
    const subTitle = this.customSubtitle();

    const parts: string[] = ['<talos-drop-zone'];
    if (title !== 'Choose a file or drag & drop it here') parts.push(`title="${title}"`);
    if (subTitle) parts.push(`subTitle="${subTitle}"`);
    if (accept) parts.push(`accept="${accept}"`);
    if (!multiple) parts.push('[multiple]="false"');
    if (maxFileSize) parts.push(`maxFileSize="${maxFileSize}"`);
    if (maxFiles !== null) parts.push(`[maxFiles]="${maxFiles}"`);
    if (size !== 'md') parts.push(`size="${size}"`);
    if (variant !== 'default') parts.push(`variant="${variant}"`);
    if (disabled) parts.push('[disabled]="true"');
    if (readonly) parts.push('[readonly]="true"');
    if (loading) parts.push('[loading]="true"');
    parts.push('[(ngModel)]="stagedFiles"');
    parts.push('(rejected)="onRejected($event)"');
    parts.push('/>');

    return parts.join('\n  ');
  });

  protected copyCode(): void {
    navigator.clipboard.writeText(this.codeSnippet());
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 2000);
  }
}
