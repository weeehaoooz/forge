import {
  Directive,
  ElementRef,
  computed,
  effect,
  inject,
  input
} from '@angular/core';
import { TalosCheckboxGroupDirective } from '../checkbox-group/checkbox-group.directive';
import { TalosCheckboxDirective } from '../checkbox/checkbox.directive';

@Directive({
  selector: 'input[type="checkbox"][talosCheckboxParent], input[type="checkbox"][talos-checkbox-parent], input[type="checkbox"][talosSelectAll], input[type="checkbox"][talos-select-all]',
  exportAs: 'talosCheckboxParent',
  host: {
    '[checked]': 'isAllSelected()',
    '[indeterminate]': 'isIndeterminate()',
    '[class.is-indeterminate]': 'isIndeterminate()',
    '(change)': 'onParentToggle($event)'
  }
})
export class TalosCheckboxParentDirective {
  private readonly elementRef = inject(ElementRef<HTMLInputElement>);
  private readonly checkboxDir = inject(TalosCheckboxDirective, { optional: true, self: true });
  private readonly ancestorGroup = inject(TalosCheckboxGroupDirective, { optional: true });

  /** Optional explicit reference to a TalosCheckboxGroupDirective instance */
  readonly group = input<TalosCheckboxGroupDirective | undefined>(undefined);

  /** List of all selectable values for the parent checkbox to manage */
  readonly values = input<any[]>([]);

  /** Effective active checkbox group */
  readonly targetGroup = computed(() => this.group() || this.ancestorGroup);

  /** Whether all target values are selected */
  readonly isAllSelected = computed(() => {
    const grp = this.targetGroup();
    const allVals = this.values();
    if (!grp || allVals.length === 0) return false;

    const selectedVals = grp.value();
    return allVals.every((val) => selectedVals.includes(val));
  });

  /** Whether some (but not all) target values are selected */
  readonly isIndeterminate = computed(() => {
    const grp = this.targetGroup();
    const allVals = this.values();
    if (!grp || allVals.length === 0) return false;

    const selectedVals = grp.value();
    const count = allVals.filter((val) => selectedVals.includes(val)).length;
    return count > 0 && count < allVals.length;
  });

  constructor() {
    // Keep element's indeterminate property synced dynamically
    effect(() => {
      const indeterminate = this.isIndeterminate();
      if (this.elementRef.nativeElement) {
        this.elementRef.nativeElement.indeterminate = indeterminate;
      }
    });
  }

  onParentToggle(event: Event): void {
    const grp = this.targetGroup();
    const allVals = this.values();
    if (!grp || allVals.length === 0) return;

    if (this.isAllSelected()) {
      // If currently all selected, deselect all values managed by this parent
      const currentSelected = grp.value();
      const remaining = currentSelected.filter((v) => !allVals.includes(v));
      grp.selectAll(remaining);
    } else {
      // If none or indeterminate, select all values managed by this parent
      const currentSelected = grp.value();
      const updated = Array.from(new Set([...currentSelected, ...allVals]));
      grp.selectAll(updated);
    }
  }
}
