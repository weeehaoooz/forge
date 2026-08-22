import {
  Component,
  ElementRef,
  TemplateRef,
  ViewChild,
  computed,
  forwardRef,
  inject,
  input,
  model,
  output,
  signal
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgTemplateOutlet } from '@angular/common';
import {
  DropZoneChangeEvent,
  DropZoneFile,
  DropZoneFileStatus,
  DropZoneRejection,
  DropZoneSize,
  DropZoneValidatorFn,
  DropZoneVariant,
  FileRejectionReason
} from './drop-zone.types';
import { TalosFileDropDirective } from './drop-zone.directive';

let uniqueDropZoneIdCounter = 0;

@Component({
  selector: 'talos-drop-zone, talos-file-upload',
  imports: [NgTemplateOutlet, TalosFileDropDirective],
  templateUrl: './drop-zone.component.html',
  styleUrl: './drop-zone.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TalosDropZoneComponent),
      multi: true
    }
  ],
  host: {
    'class': 'talos-drop-zone-host',
    '[class.is-disabled]': 'effectiveDisabled()',
    '[class.is-readonly]': 'readonly()',
    '[class.is-loading]': 'loading()',
    '[class.is-drag-over]': 'isDragOver()',
    '[class.variant-default]': 'variant() === "default"',
    '[class.variant-compact]': 'variant() === "compact"',
    '[class.variant-mini]': 'variant() === "mini"',
    '[class.variant-card]': 'variant() === "card"',
    '[class.size-sm]': 'size() === "sm"',
    '[class.size-md]': 'size() === "md"',
    '[class.size-lg]': 'size() === "lg"'
  }
})
export class TalosDropZoneComponent implements ControlValueAccessor {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  // --- Signal Inputs ---
  /** Accepted file types / extensions (e.g. "image/*", ".pdf,.docx", "image/png,image/jpeg") */
  readonly accept = input<string>('');

  /** Allow selecting multiple files */
  readonly multiple = input<boolean>(true);

  /** Maximum file size in bytes or human-readable string (e.g. 5242880 or '5MB') */
  readonly maxFileSize = input<number | string | null>(null);

  /** Minimum file size in bytes or human-readable string (e.g. 1024 or '1KB') */
  readonly minFileSize = input<number | string | null>(null);

  /** Maximum total number of files allowed */
  readonly maxFiles = input<number | null>(null);

  /** Disable user interactions */
  readonly disabled = input<boolean>(false);

  /** Make drop zone read-only */
  readonly readonly = input<boolean>(false);

  /** Display loading / processing spinner */
  readonly loading = input<boolean>(false);

  /** Layout visual variant */
  readonly variant = input<DropZoneVariant>('default');

  /** Sizing variant */
  readonly size = input<DropZoneSize>('md');

  /** Primary title displayed in the drop zone */
  readonly title = input<string>('Choose a file or drag & drop it here');

  /** Subtitle / hint text displayed below the title */
  readonly subTitle = input<string>('JPEG, PNG, PDF, and DOC formats, up to 50 MB');

  /** Text label for the browse button/link */
  readonly browseLabel = input<string>('Browse file');

  /** Secondary bottom helper text or error message */
  readonly hint = input<string>('');

  /** Whether to render the built-in staged file list preview */
  readonly showFileList = input<boolean>(true);

  /** Automatically manage staged files in internal state when dropped/selected */
  readonly autoManageFiles = input<boolean>(true);

  /** Automatically generate object URL thumbnails for image files */
  readonly autoGeneratePreviews = input<boolean>(true);

  /** Allow removing staged files */
  readonly removable = input<boolean>(true);

  /** Allow retrying failed uploads */
  readonly allowRetry = input<boolean>(true);

  /** Custom validator function for individual files */
  readonly validator = input<DropZoneValidatorFn | null>(null);

  /** Custom template for rendering staged file list items */
  readonly itemTemplate = input<TemplateRef<{ $implicit: DropZoneFile; index: number; remove: () => void; retry: () => void }> | null>(null);

  /** Custom template for rendering drop zone inner content */
  readonly contentTemplate = input<TemplateRef<void> | null>(null);

  /** Component DOM ID */
  readonly id = input<string>('');

  /** Form control name */
  readonly name = input<string>('');

  // --- Two-way Model Signal ---
  /** Staged / uploaded files model */
  readonly files = model<DropZoneFile[]>([]);

  // --- Signal Outputs ---
  /** Emitted with raw native File objects */
  readonly rawFilesChange = output<File[]>();

  /** Emitted when files are dropped */
  readonly fileDrop = output<File[]>();

  /** Emitted when files are selected via native file dialog */
  readonly fileSelect = output<File[]>();

  /** Emitted when a file is removed */
  readonly fileRemove = output<DropZoneFile>();

  /** Emitted when a file retry button is clicked */
  readonly fileRetry = output<DropZoneFile>();

  /** Emitted when files fail validation */
  readonly rejected = output<DropZoneRejection[]>();

  /** Emitted when drag over state changes */
  readonly dragStateChange = output<boolean>();

  /** Emitted with full change event payload */
  readonly change = output<DropZoneChangeEvent>();

  // --- View Children ---
  @ViewChild('fileInput') fileInput?: ElementRef<HTMLInputElement>;

  // --- IDs & Internal Signals ---
  private readonly autoId = `talos-dropzone-${uniqueDropZoneIdCounter++}`;
  readonly componentId = computed(() => this.id() || this.autoId);
  readonly inputId = computed(() => `${this.componentId()}-input`);

  readonly isDragOver = signal<boolean>(false);
  readonly isDisabled = signal<boolean>(false);
  readonly isTouched = signal<boolean>(false);


  // --- Computed States ---
  readonly effectiveDisabled = computed(() => this.disabled() || this.isDisabled() || this.readonly());

  readonly maxSizeBytes = computed(() => this.parseByteSize(this.maxFileSize()));
  readonly minSizeBytes = computed(() => this.parseByteSize(this.minFileSize()));

  readonly hasFiles = computed(() => this.files().length > 0);

  readonly isMaxFilesReached = computed(() => {
    const max = this.maxFiles();
    if (max === null || max === undefined) return false;
    return this.files().length >= max;
  });

  // --- ControlValueAccessor Callbacks ---
  private onChange: (value: DropZoneFile[] | File[]) => void = () => {};
  private onTouched: () => void = () => {};

  // --- ControlValueAccessor Implementation ---

  writeValue(value: DropZoneFile[] | File[] | File | null): void {
    if (value === null || value === undefined) {
      this.files.set([]);
      return;
    }

    if (Array.isArray(value)) {
      const parsedFiles = value.map((item, idx) => {
        if (item instanceof File) {
          return this.createDropZoneFile(item, `file-${idx}`);
        }
        return item as DropZoneFile;
      });
      this.files.set(parsedFiles);
    } else if (value instanceof File) {
      this.files.set([this.createDropZoneFile(value, 'file-0')]);
    } else if (typeof value === 'object' && 'file' in (value as object)) {
      this.files.set([value as DropZoneFile]);
    }
  }

  registerOnChange(fn: (value: DropZoneFile[] | File[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  // --- Public / Interaction Methods ---

  /**
   * Opens the native file selector dialog.
   */
  openFileDialog(): void {
    if (this.effectiveDisabled() || this.isMaxFilesReached()) return;
    if (this.fileInput) {
      // Reset input value to allow selecting the same file again
      this.fileInput.nativeElement.value = '';
      this.fileInput.nativeElement.click();
    }
  }

  /**
   * Keyboard handler on the drop zone container (Enter / Space to open browse dialog)
   */
  onKeyDown(event: KeyboardEvent): void {
    if (this.effectiveDisabled()) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.openFileDialog();
    }
  }

  /**
   * Native file input change handler
   */
  onNativeInputChange(event: Event): void {
    if (this.effectiveDisabled()) return;
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const files = Array.from(input.files);
    this.fileSelect.emit(files);
    this.processFiles(files);
    this.markAsTouched();
  }

  /**
   * Handles files dropped onto the dropzone
   */
  onDropFiles(droppedFiles: File[]): void {
    if (this.effectiveDisabled()) return;
    this.fileDrop.emit(droppedFiles);
    this.processFiles(droppedFiles);
    this.markAsTouched();
  }

  /**
   * Updates drag over state
   */
  onDragState(isOver: boolean): void {
    if (this.effectiveDisabled()) return;
    this.isDragOver.set(isOver);
    this.dragStateChange.emit(isOver);
  }

  /**
   * Removes a file from the staged list
   */
  removeFile(dropFile: DropZoneFile, event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    if (this.effectiveDisabled() || !this.removable()) return;

    // Revoke preview URL if created
    if (dropFile.previewUrl && dropFile.previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(dropFile.previewUrl);
    }

    const updated = this.files().filter((f) => f.id !== dropFile.id);
    this.files.set(updated);
    this.fileRemove.emit(dropFile);
    this.emitChanges(updated);
    this.markAsTouched();
  }

  /**
   * Retries uploading a file
   */
  retryFile(dropFile: DropZoneFile, event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    if (this.effectiveDisabled() || !this.allowRetry()) return;

    // Update status to pending
    const updated = this.files().map((f) => {
      if (f.id === dropFile.id) {
        return { ...f, status: 'pending' as DropZoneFileStatus, errorMessage: undefined, progress: 0 };
      }
      return f;
    });

    this.files.set(updated);
    this.fileRetry.emit(dropFile);
    this.emitChanges(updated);
  }

  /**
   * Updates the progress or status of a staged file programmatically.
   */
  updateFileProgress(fileId: string, progress: number, status?: DropZoneFileStatus, errorMessage?: string): void {
    const updated = this.files().map((f) => {
      if (f.id === fileId) {
        return {
          ...f,
          progress: Math.min(100, Math.max(0, progress)),
          status: status ?? (progress >= 100 ? 'success' : 'uploading'),
          errorMessage
        };
      }
      return f;
    });
    this.files.set(updated);
    this.emitChanges(updated);
  }

  /**
   * Clear all files from the drop zone.
   */
  clearFiles(): void {
    // Revoke preview URLs
    for (const f of this.files()) {
      if (f.previewUrl && f.previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(f.previewUrl);
      }
    }
    this.files.set([]);
    this.emitChanges([]);
    this.markAsTouched();
  }

  // --- Processing & Validation ---

  private processFiles(rawFiles: File[]): void {
    if (!rawFiles || rawFiles.length === 0) return;

    const currentFiles = this.files();
    const accepted: DropZoneFile[] = [];
    const rejections: DropZoneRejection[] = [];

    const isMultiple = this.multiple();
    const maxFilesAllowed = this.maxFiles();

    // If single mode, replace existing or take only the first file
    const targetFiles = isMultiple ? rawFiles : [rawFiles[0]];

    for (const file of targetFiles) {
      // Check total count constraint
      const simulatedCount = isMultiple ? currentFiles.length + accepted.length : accepted.length;
      if (maxFilesAllowed !== null && maxFilesAllowed !== undefined && simulatedCount >= maxFilesAllowed) {
        rejections.push({
          file,
          reason: 'MAX_FILES_EXCEEDED',
          message: `Maximum allowed number of files (${maxFilesAllowed}) reached.`
        });
        continue;
      }

      // Check file validation
      const validation = this.validateFile(file);
      if (!validation.valid && validation.rejection) {
        rejections.push(validation.rejection);
        continue;
      }

      const dropZoneFile = this.createDropZoneFile(file);
      accepted.push(dropZoneFile);
    }

    if (rejections.length > 0) {
      this.rejected.emit(rejections);
    }

    if (accepted.length > 0 && this.autoManageFiles()) {
      let nextFiles: DropZoneFile[];
      if (isMultiple) {
        nextFiles = [...currentFiles, ...accepted];
      } else {
        // Clear previous previews if replacing
        for (const f of currentFiles) {
          if (f.previewUrl && f.previewUrl.startsWith('blob:')) {
            URL.revokeObjectURL(f.previewUrl);
          }
        }
        nextFiles = accepted;
      }

      this.files.set(nextFiles);
      this.emitChanges(nextFiles, rejections);
    } else if (rejections.length > 0) {
      this.change.emit({
        files: currentFiles,
        rawFiles: currentFiles.map((f) => f.file),
        rejected: rejections
      });
    }
  }

  private validateFile(file: File): { valid: boolean; rejection?: DropZoneRejection } {
    // 1. Accept filter check
    const acceptStr = this.accept();
    if (acceptStr && !this.checkAccept(file, acceptStr)) {
      return {
        valid: false,
        rejection: {
          file,
          reason: 'INVALID_TYPE',
          message: `File type "${file.type || 'unknown'}" is not supported.`
        }
      };
    }

    // 2. Max file size check
    const maxBytes = this.maxSizeBytes();
    if (maxBytes !== null && file.size > maxBytes) {
      return {
        valid: false,
        rejection: {
          file,
          reason: 'FILE_TOO_LARGE',
          message: `File size (${this.formatBytes(file.size)}) exceeds maximum limit of ${this.formatBytes(maxBytes)}.`
        }
      };
    }

    // 3. Min file size check
    const minBytes = this.minSizeBytes();
    if (minBytes !== null && file.size < minBytes) {
      return {
        valid: false,
        rejection: {
          file,
          reason: 'FILE_TOO_SMALL',
          message: `File size (${this.formatBytes(file.size)}) is smaller than minimum required ${this.formatBytes(minBytes)}.`
        }
      };
    }

    // 4. Custom validator check
    const customVal = this.validator();
    if (customVal) {
      const errorMsg = customVal(file);
      if (errorMsg) {
        return {
          valid: false,
          rejection: {
            file,
            reason: 'CUSTOM_VALIDATION_FAILED',
            message: errorMsg
          }
        };
      }
    }

    return { valid: true };
  }

  private checkAccept(file: File, accept: string): boolean {
    const rules = accept.split(',').map((r) => r.trim().toLowerCase());
    const fileName = file.name.toLowerCase();
    const fileType = file.type.toLowerCase();

    for (const rule of rules) {
      if (!rule) continue;

      if (rule.startsWith('.')) {
        // Extension check (e.g. .pdf, .png)
        if (fileName.endsWith(rule)) return true;
      } else if (rule.endsWith('/*')) {
        // Wildcard MIME check (e.g. image/*, video/*, audio/*)
        const prefix = rule.slice(0, -1); // "image/"
        if (fileType.startsWith(prefix)) return true;
      } else if (fileType === rule) {
        // Exact MIME check (e.g. application/pdf)
        return true;
      }
    }

    return false;
  }

  private createDropZoneFile(file: File, idPrefix = 'file'): DropZoneFile {
    const id = `${idPrefix}-${Math.random().toString(36).substring(2, 9)}`;
    let previewUrl: string | undefined;

    if (this.autoGeneratePreviews() && file.type.startsWith('image/')) {
      try {
        previewUrl = URL.createObjectURL(file);
      } catch {
        previewUrl = undefined;
      }
    }

    return {
      id,
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      progress: 0,
      status: 'pending',
      previewUrl
    };
  }

  private emitChanges(updatedFiles: DropZoneFile[], rejections: DropZoneRejection[] = []): void {
    const raw = updatedFiles.map((f) => f.file);
    this.rawFilesChange.emit(raw);
    this.onChange(updatedFiles);
    this.change.emit({
      files: updatedFiles,
      rawFiles: raw,
      rejected: rejections
    });
  }

  private markAsTouched(): void {
    if (!this.isTouched()) {
      this.isTouched.set(true);
      this.onTouched();
    }
  }

  // --- Formatters & Helpers ---

  parseByteSize(size: number | string | null | undefined): number | null {
    if (size === null || size === undefined || size === '') return null;
    if (typeof size === 'number') return size;

    const cleaned = size.trim().toUpperCase();
    const match = cleaned.match(/^(\d+(?:\.\d+)?)\s*(B|KB|MB|GB|TB)?$/);
    if (!match) return null;

    const num = parseFloat(match[1]);
    const unit = match[2] || 'B';

    const multipliers: Record<string, number> = {
      B: 1,
      KB: 1024,
      MB: 1024 * 1024,
      GB: 1024 * 1024 * 1024,
      TB: 1024 * 1024 * 1024 * 1024
    };

    return Math.round(num * (multipliers[unit] || 1));
  }

  formatBytes(bytes: number, decimals = 1): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const formatted = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));
    return `${formatted} ${sizes[i]}`;
  }

  getFileTypeCategory(file: DropZoneFile): 'image' | 'pdf' | 'doc' | 'archive' | 'audio' | 'video' | 'code' | 'generic' {
    const type = file.type.toLowerCase();
    const name = file.name.toLowerCase();

    if (type.startsWith('image/') || /\.(png|jpg|jpeg|gif|webp|svg|bmp|ico)$/.test(name)) return 'image';
    if (type === 'application/pdf' || name.endsWith('.pdf')) return 'pdf';
    if (
      type.includes('word') ||
      type.includes('document') ||
      type.includes('sheet') ||
      type.includes('excel') ||
      type.includes('presentation') ||
      type.includes('powerpoint') ||
      /\.(doc|docx|xls|xlsx|ppt|pptx|txt|rtf|csv)$/.test(name)
    ) {
      return 'doc';
    }
    if (type.includes('zip') || type.includes('compressed') || type.includes('tar') || /\.(zip|rar|7z|tar|gz)$/.test(name)) {
      return 'archive';
    }
    if (type.startsWith('audio/') || /\.(mp3|wav|ogg|flac|m4a)$/.test(name)) return 'audio';
    if (type.startsWith('video/') || /\.(mp4|webm|mkv|mov|avi)$/.test(name)) return 'video';
    if (/\.(ts|js|json|html|css|scss|py|go|rs|java|c|cpp|sql|xml|yaml|yml)$/.test(name)) return 'code';

    return 'generic';
  }
}
