import { DialogRef } from '@angular/cdk/dialog';
import { Observable } from 'rxjs';
import { TalosDialogConfig } from './dialog.types';

/**
 * Reference to an actively open dialog instance.
 */
export class TalosDialogRef<R = unknown, D = unknown> {
  constructor(
    readonly cdkDialogRef: DialogRef<R, unknown>,
    readonly config: TalosDialogConfig<D>,
    readonly data?: D
  ) {}

  /** Unique identifier for the dialog */
  get id(): string {
    return this.cdkDialogRef.id;
  }

  /** Observable that emits when the dialog is closed with the result value */
  get closed(): Observable<R | undefined> {
    return this.cdkDialogRef.closed;
  }

  /** Observable that emits when the backdrop overlay is clicked */
  get backdropClick(): Observable<MouseEvent> {
    return this.cdkDialogRef.backdropClick;
  }

  /** Observable that emits keyboard events received by the dialog overlay */
  get keydownEvents(): Observable<KeyboardEvent> {
    return this.cdkDialogRef.keydownEvents;
  }

  /**
   * Close the dialog, optionally returning a result value to the opener.
   */
  close(result?: R): void {
    this.cdkDialogRef.close(result);
  }

  /**
   * Dynamically update the size of the dialog panel.
   */
  updateSize(width = '', height = ''): this {
    this.cdkDialogRef.updateSize(width, height);
    return this;
  }

  /**
   * Add CSS class(es) to the dialog overlay panel.
   */
  addPanelClass(classes: string | string[]): this {
    this.cdkDialogRef.addPanelClass(classes);
    return this;
  }

  /**
   * Remove CSS class(es) from the dialog overlay panel.
   */
  removePanelClass(classes: string | string[]): this {
    this.cdkDialogRef.removePanelClass(classes);
    return this;
  }
}
