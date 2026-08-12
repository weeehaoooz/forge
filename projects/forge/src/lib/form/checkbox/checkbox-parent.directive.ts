import {
  Directive,
  ElementRef,
  computed,
  effect,
  inject,
  input
} from '@angular/core';
import { ForgeCheckboxGroupDirective } from './checkbox-group.directive';
import { ForgeCheckboxDirective } from './checkbox.directive';

@Directive({
  selector: 'input[type="checkbox"][forgeCheckboxParent], input[type="checkbox"][forge-checkbox-parent], input[type="checkbox"][forgeSelectAll], input[type="checkbox"][forge-select-all]',
  exportAs: 'forgeCheckboxParent',
  host: {
    '[checked]': 'isAllSelected()',
    '[indeterminate]': 'isIndeterminate()',
    '[class.is-indeterminate]': 'isIndeterminate()',
    '(change)': 'onParentToggle($event)'
  }
})
export class ForgeCheckboxParentDirective {
  private readonly elementRef = inject(ElementRef<HTMLInputElement>);
  private readonly checkboxDir = inject(ForgeCheckboxDirective, { optional: true, self: true });
  private readonly ancestorGroup = inject(ForgeCheckboxGroupDirective, { optional: true });

  /** Optional explicit reference to a ForgeCheckboxGroupDirective instance */
  readonly group = input<ForgeCheckboxGroupDirective | undefined>(undefined);

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
