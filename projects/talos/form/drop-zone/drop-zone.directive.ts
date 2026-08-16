import { Directive, ElementRef, inject, input, output, signal } from '@angular/core';

@Directive({
  selector: '[talosFileDrop], [talos-file-drop]',
  host: {
    'class': 'talos-file-drop-target',
    '[class.is-drag-over]': 'isDragOver()',
    '[class.is-disabled]': 'disabled()',
    '(dragover)': 'onDragOver($event)',
    '(dragenter)': 'onDragEnter($event)',
    '(dragleave)': 'onDragLeave($event)',
    '(drop)': 'onDrop($event)'
  }
})
export class TalosFileDropDirective {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  /** Whether the drop target is disabled */
  readonly disabled = input<boolean>(false);

  /** Signal emitting when files are dropped onto the element */
  readonly fileDrop = output<File[]>();

  /** Signal emitting when a drag enters the element */
  readonly dragOver = output<DragEvent>();

  /** Signal emitting when a drag leaves the element */
  readonly dragLeave = output<DragEvent>();

  /** Internal signal tracking active drag over state */
  readonly isDragOver = signal<boolean>(false);

  /** Counter to handle dragenter/dragleave transitions between child elements */
  private dragCounter = 0;

  onDragOver(event: DragEvent): void {
    if (this.disabled()) return;
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'copy';
    }
  }

  onDragEnter(event: DragEvent): void {
    if (this.disabled()) return;
    event.preventDefault();
    event.stopPropagation();
    this.dragCounter++;

    if (this.dragCounter === 1) {
      this.isDragOver.set(true);
      this.dragOver.emit(event);
    }
  }

  onDragLeave(event: DragEvent): void {
    if (this.disabled()) return;
    event.preventDefault();
    event.stopPropagation();
    this.dragCounter--;

    if (this.dragCounter <= 0) {
      this.dragCounter = 0;
      this.isDragOver.set(false);
      this.dragLeave.emit(event);
    }
  }

  onDrop(event: DragEvent): void {
    if (this.disabled()) return;
    event.preventDefault();
    event.stopPropagation();
    this.dragCounter = 0;
    this.isDragOver.set(false);

    const dataTransfer = event.dataTransfer;
    if (!dataTransfer || !dataTransfer.files || dataTransfer.files.length === 0) {
      return;
    }

    const files: File[] = Array.from(dataTransfer.files);
    this.fileDrop.emit(files);
  }
}
