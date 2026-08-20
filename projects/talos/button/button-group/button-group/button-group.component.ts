import {
  Component,
  ElementRef,
  inject,
  input,
  model,
  contentChildren,
  effect,
  HostListener
} from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { TalosButtonDirective, ButtonSize } from '@daedal-dev/talos-ui/button';

import { TalosButtonGroupItemDirective } from '../button-group-item/button-group-item.directive';

export type ButtonGroupOrientation = 'horizontal' | 'vertical';
export type ButtonGroupVariant = 'attached' | 'segmented' | 'outline' | 'subtle' | 'pill';
export type ButtonGroupSelectionMode = 'none' | 'single' | 'multiple';

@Component({
  selector: 'talos-button-group',
  template: `<ng-content></ng-content>`,
  host: {
    'class': 'talos-button-group',
    '[class.talos-button-group-horizontal]': 'orientation() === "horizontal"',
    '[class.talos-button-group-vertical]': 'orientation() === "vertical"',
    '[class.talos-button-group-attached]': 'variant() === "attached"',
    '[class.talos-button-group-segmented]': 'variant() === "segmented"',
    '[class.talos-button-group-outline]': 'variant() === "outline"',
    '[class.talos-button-group-subtle]': 'variant() === "subtle"',
    '[class.talos-button-group-pill]': 'pill() || variant() === "pill"',
    '[class.talos-button-group-sm]': 'size() === "sm"',
    '[class.talos-button-group-md]': 'size() === "md"',
    '[class.talos-button-group-lg]': 'size() === "lg"',
    '[attr.role]': 'selectionMode() !== "none" ? "radiogroup" : "group"',
    '[attr.aria-orientation]': 'orientation()',
    '(keydown)': 'onKeydown($event)',
    '(click)': 'onClick($event)'
  }
})
export class TalosButtonGroupComponent {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  /** Layout orientation: horizontal or vertical */
  readonly orientation = input<ButtonGroupOrientation>('horizontal');

  /** Visual variant style */
  readonly variant = input<ButtonGroupVariant>('attached');

  /** Button size propagation */
  readonly size = input<ButtonSize>('md');

  /** Selection behavior: none, single (radio), or multiple (checkbox) */
  readonly selectionMode = input<ButtonGroupSelectionMode>('none');

  /** Model value for single or multiple selection */
  readonly value = model<any>(undefined);

  /** Apply fully rounded pill shape */
  readonly pill = input<boolean>(false);

  /** Disable all buttons in group */
  readonly disabled = input<boolean>(false);

  /** Child items using TalosButtonGroupItemDirective */
  readonly items = contentChildren(TalosButtonGroupItemDirective, { descendants: true });

  /** Child directives using TalosButtonDirective */
  readonly buttons = contentChildren(TalosButtonDirective, { descendants: true });

  private selectionModel = new SelectionModel<any>(false, []);

  constructor() {
    // Sync SelectionModel mode when selectionMode changes
    effect(() => {
      const mode = this.selectionMode();
      const isMulti = mode === 'multiple';
      const currentVal = this.value();

      const initial = currentVal !== undefined
        ? (Array.isArray(currentVal) ? currentVal : [currentVal])
        : [];

      this.selectionModel = new SelectionModel<any>(isMulti, initial);
      this.syncChildSelectionStates();
    });

    // Sync external model value changes to internal selection model
    effect(() => {
      const val = this.value();
      if (val !== undefined && this.selectionMode() !== 'none') {
        const selectedValues = Array.isArray(val) ? val : [val];
        this.selectionModel.clear();
        selectedValues.forEach(v => this.selectionModel.select(v));
        this.syncChildSelectionStates();
      }
    });

    // Propagate item selected state changes
    effect(() => {
      const childItems = this.items();
      this.syncChildSelectionStates();
    });
  }

  private syncChildSelectionStates(): void {
    const childItems = this.items();
    if (!childItems || childItems.length === 0) return;

    childItems.forEach((item, index) => {
      const itemVal = item.value() !== undefined ? item.value() : index;
      const isSelected = this.selectionModel.isSelected(itemVal);
      item.selected.set(isSelected);
    });
  }

  onClick(event: MouseEvent): void {
    if (this.disabled()) return;
    const mode = this.selectionMode();
    if (mode === 'none') return;

    const target = event.target as HTMLElement;
    const buttonEl = target.closest('button, a') as HTMLElement;
    if (!buttonEl) return;

    const childItems = this.items();
    const childButtons = this.buttons();

    // Match clicked button to item directive or index
    let matchedValue: any = undefined;
    let matchedItem: TalosButtonGroupItemDirective | undefined = undefined;

    if (childItems && childItems.length > 0) {
      childItems.forEach((item, index) => {
        if (item.elementRef.nativeElement === buttonEl || item.elementRef.nativeElement.contains(buttonEl)) {
          matchedValue = item.value() !== undefined ? item.value() : index;
          matchedItem = item;
        }
      });
    }

    if (matchedValue === undefined && childButtons && childButtons.length > 0) {
      const allButtons = Array.from(this.elementRef.nativeElement.querySelectorAll('button, a'));
      const index = allButtons.indexOf(buttonEl);
      if (index !== -1) {
        matchedValue = index;
      }
    }

    if (matchedValue !== undefined) {
      if (mode === 'single') {
        this.selectionModel.clear();
        this.selectionModel.select(matchedValue);
        this.value.set(matchedValue);
      } else if (mode === 'multiple') {
        this.selectionModel.toggle(matchedValue);
        this.value.set(this.selectionModel.selected);
      }
      this.syncChildSelectionStates();
    }
  }

  onKeydown(event: KeyboardEvent): void {
    const isHoriz = this.orientation() === 'horizontal';
    const focusableButtons = Array.from(
      this.elementRef.nativeElement.querySelectorAll<HTMLButtonElement | HTMLAnchorElement>('button:not([disabled]), a:not([disabled])')
    );

    if (focusableButtons.length === 0) return;

    const activeEl = document.activeElement as HTMLElement;
    let currentIndex = focusableButtons.indexOf(activeEl as any);

    if (currentIndex === -1) return;

    let targetIndex = -1;

    if ((isHoriz && event.key === 'ArrowRight') || (!isHoriz && event.key === 'ArrowDown')) {
      targetIndex = (currentIndex + 1) % focusableButtons.length;
    } else if ((isHoriz && event.key === 'ArrowLeft') || (!isHoriz && event.key === 'ArrowUp')) {
      targetIndex = (currentIndex - 1 + focusableButtons.length) % focusableButtons.length;
    } else if (event.key === 'Home') {
      targetIndex = 0;
    } else if (event.key === 'End') {
      targetIndex = focusableButtons.length - 1;
    }

    if (targetIndex !== -1) {
      event.preventDefault();
      focusableButtons[targetIndex].focus();
    }
  }
}
