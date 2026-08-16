/**
 * Status of a file being tracked or uploaded in the Drop Zone.
 */
export type DropZoneFileStatus = 'pending' | 'uploading' | 'success' | 'error';

/**
 * Visual layout variants for the Drop Zone.
 */
export type DropZoneVariant = 'default' | 'compact' | 'mini' | 'card';

/**
 * Size variants for the Drop Zone.
 */
export type DropZoneSize = 'sm' | 'md' | 'lg';

/**
 * Rejection reason codes when an added file fails validation.
 */
export type FileRejectionReason =
  | 'INVALID_TYPE'
  | 'FILE_TOO_LARGE'
  | 'FILE_TOO_SMALL'
  | 'MAX_FILES_EXCEEDED'
  | 'DUPLICATE_FILE'
  | 'CUSTOM_VALIDATION_FAILED';

/**
 * Information regarding a file rejected during drag & drop or selection.
 */
export interface DropZoneRejection {
  file: File;
  reason: FileRejectionReason;
  message: string;
}

/**
 * Wrapper object representing an uploaded or staged file in the Drop Zone.
 */
export interface DropZoneFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  progress?: number;
  status?: DropZoneFileStatus;
  errorMessage?: string;
  previewUrl?: string;
  data?: unknown;
}

/**
 * Custom file validation function. Returns null if valid or an error message string if invalid.
 */
export type DropZoneValidatorFn = (file: File) => string | null;

/**
 * Event payload emitted when files are dropped or selected.
 */
export interface DropZoneChangeEvent {
  files: DropZoneFile[];
  rawFiles: File[];
  rejected: DropZoneRejection[];
}
