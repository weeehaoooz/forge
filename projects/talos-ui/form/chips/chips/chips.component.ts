import {
  Component,
  ElementRef,
  TemplateRef,
  ViewChild,
  computed,
  effect,
  forwardRef,
  inject,
  input,
  output,
  signal
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgTemplateOutlet } from '@angular/common';
import {
  ChipColor,
  ChipDisplayFn,
  ChipFilterFn,
  ChipHighlightPart,
  ChipItemContext,
  ChipSize,
  ChipValueFn,
  ChipVariant,
  FormattedChipOption
} from '../chips.types';
import { TalosChipComponent } from '../chip/chip.component';

let uniqueChipsIdCounter = 0;

export interface SelectedChipData {
  display: string;
  value: unknown;
  originalItem: unknown;
}

@Component({
  selector: 'talos-chips',
  imports: [NgTemplateOutlet, TalosChipComponent],
  templateUrl: './chips.component.html',
  styleUrl: './chips.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TalosChipsComponent),
      multi: true
    }
  ],
  host: {
    'class': 'talos-chips-host',
    '[class.is-open]': 'isOpen()',
    '[class.is-disabled]': 'effectiveDisabled()',
    '[class.is-searching]': 'effectiveSearching()',
    '[class.has-label]': '!!label()',
    '[class.is-floating]': 'isFloatingMode()',
    '[class.is-floated]': 'isFloated()',
    '[class.chips-sm]': 'size() === "sm"',
    '[class.chips-md]': 'size() === "md"',
    '[class.chips-lg]': 'size() === "lg"',
    '(document:click)': 'onDocumentClick($event)'
  }
})
export class TalosChipsComponent<T = unknown> implements ControlValueAccessor {
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  // Signal Inputs
  readonly options = input<readonly T[] | T[]>([]);
  readonly label = input<string>('');
  readonly floatingLabel = input<boolean>(false);
  readonly floating = input<boolean>(false);
  readonly required = input<boolean>(false);
  readonly searching = input<boolean>(false);
  readonly loading = input<boolean>(false);
  readonly placeholder = input<string>('Type or select...');
  readonly disabled = input<boolean>(false);
  readonly clearable = input<boolean>(true);
  readonly removable = input<boolean>(true);
  readonly size = input<ChipSize>('sm');
  readonly maxChips = input<number | null>(null);
  readonly allowCustom = input<boolean>(false);
  readonly separatorKeys = input<string[]>(['Enter', ',']);
  readonly displayWith = input<ChipDisplayFn<T> | keyof T | null>(null);
  readonly valueWith = input<ChipValueFn<T> | keyof T | null>(null);
  readonly filterFn = input<ChipFilterFn<T> | null | undefined>(undefined);
  readonly highlightMatch = input<boolean>(true);
  readonly noResultsText = input<string>('No matching options');
  readonly searchingText = input<string>('Searching...');
  readonly chipVariant = input<ChipVariant>('subtle');
  readonly chipColor = input<ChipColor>('primary');
  readonly itemTemplate = input<TemplateRef<ChipItemContext<T>> | null>(null);
  readonly openOnFocus = input<boolean>(true);
  readonly id = input<string>('');

  // Signal Outputs
  readonly search = output<string>();
  readonly searchChange = output<string>();
  readonly selectionChange = output<unknown[]>();
  readonly chipAdd = output<unknown>();
  readonly chipRemove = output<unknown>();
  readonly opened = output<void>();
  readonly closed = output<void>();
  readonly cleared = output<void>();

  // View Children
  @ViewChild('inputEl') inputEl?: ElementRef<HTMLInputElement>;
  @ViewChild('dropdownEl') dropdownEl?: ElementRef<HTMLDivElement>;

  // Component IDs for ARIA attributes
  private readonly autoId = `talos-chips-${uniqueChipsIdCounter++}`;
  readonly componentId = computed(() => this.id() || this.autoId);
  readonly inputId = computed(() => `${this.componentId()}-input`);
  readonly listboxId = computed(() => `${this.componentId()}-listbox`);

  // Internal Reactive State
  readonly inputValue = signal<string>('');
  readonly selectedValues = signal<unknown[]>([]);
  readonly isOpen = signal<boolean>(false);
  readonly activeIndex = signal<number>(-1);
  readonly isDisabled = signal<boolean>(false);
  readonly isTouched = signal<boolean>(false);
  readonly isInputFocused = signal<boolean>(false);

  // ControlValueAccessor Callbacks
  private onChange: (val: unknown[]) => void = () => {};
  private onTouched: () => void = () => {};

  // Computed State
  readonly effectiveDisabled = computed(() => this.disabled() || this.isDisabled());
  readonly effectiveSearching = computed(() => this.searching() || this.loading());
  readonly isFloatingMode = computed(() => this.floatingLabel() || this.floating());

  readonly isFloated = computed(() => {
    if (!this.isFloatingMode()) return false;
    return (
      this.isOpen() ||
      this.isInputFocused() ||
      this.selectedValues().length > 0 ||
      !!this.inputValue().trim()
    );
  });

  readonly isMaxReached = computed(() => {
    const max = this.maxChips();
    if (max === null || max === undefined) return false;
    return this.selectedValues().length >= max;
  });

  readonly effectivePlaceholder = computed(() => {
    if (this.isFloatingMode() && !this.isFloated()) {
      return '';
    }
    if (this.isMaxReached()) {
      return 'Maximum selections reached';
    }
    return this.placeholder();
  });

  readonly activeOptionId = computed(() => {
    const idx = this.activeIndex();
    if (idx < 0) return null;
    return `${this.componentId()}-option-${idx}`;
  });

  // Selected representations as Chips
  readonly selectedChips = computed<SelectedChipData[]>(() => {
    const values = this.selectedValues();
    const rawOpts = this.options();

    return values.map((val) => {
      // Find matching item in options if any
      const matched = rawOpts.find((opt) => this.getItemValue(opt) === val || opt === val);
      if (matched !== undefined) {
        return {
          display: this.getItemDisplay(matched),
          value: this.getItemValue(matched),
          originalItem: matched
        };
      }

      // Handle raw object with display/value or primitive
      if (val && typeof val === 'object') {
        return {
          display: this.getItemDisplay(val as T),
          value: this.getItemValue(val as T),
          originalItem: val
        };
      }

      return {
        display: String(val ?? ''),
        value: val,
        originalItem: val
      };
    });
  });

  // Filtered dropdown options
  readonly filteredOptions = computed<FormattedChipOption<T>[]>(() => {
    const rawOptions = this.options();
    const search = this.inputValue().trim();
    const customFilter = this.filterFn();
    const selectedVals = this.selectedValues();

    const result: FormattedChipOption<T>[] = [];

    for (const item of rawOptions) {
      const display = this.getItemDisplay(item);
      const value = this.getItemValue(item);
      const isSelected = selectedVals.some(
        (v) => v === value || v === item || (typeof v === 'object' && typeof value === 'object' && JSON.stringify(v) === JSON.stringify(value))
      );

      // Check if matches filter
      let matches = true;
      if (search) {
        if (customFilter === null) {
          // Explicit null filterFn indicates external/server-side filtering
          matches = true;
        } else if (typeof customFilter === 'function') {
          matches = customFilter(item, search);
        } else {
          matches = display.toLowerCase().includes(search.toLowerCase());
        }
      }

      if (matches) {
        const parts = this.highlightMatch()
          ? this.computeHighlightParts(display, search)
          : [{ text: display, matched: false }];

        result.push({
          item,
          display,
          value,
          disabled: false,
          selected: isSelected,
          parts
        });
      }
    }

    return result;
  });

  constructor() {
    // Reset activeIndex whenever filtered options change or search changes
    effect(() => {
      this.filteredOptions();
      this.activeIndex.set(-1);
    });
  }

  // --- ControlValueAccessor Implementation ---

  writeValue(value: unknown[] | unknown | null): void {
    if (value === null || value === undefined) {
      this.selectedValues.set([]);
    } else if (Array.isArray(value)) {
      this.selectedValues.set([...value]);
    } else {
      this.selectedValues.set([value]);
    }
  }

  registerOnChange(fn: (val: unknown[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
    if (isDisabled && this.isOpen()) {
      this.closeDropdown();
    }
  }

  // --- Helpers for Display & Value Extraction ---

  getItemDisplay(item: T): string {
    if (item === null || item === undefined) return '';
    const displayFn = this.displayWith();
    if (typeof displayFn === 'function') {
      return displayFn(item);
    }
    if (typeof displayFn === 'string' && typeof item === 'object') {
      return String((item as Record<string, unknown>)[displayFn] ?? '');
    }
    if (typeof item === 'object') {
      const obj = item as Record<string, unknown>;
      if ('label' in obj) return String(obj['label']);
      if ('name' in obj) return String(obj['name']);
      if ('title' in obj) return String(obj['title']);
      if ('value' in obj) return String(obj['value']);
    }
    return String(item);
  }

  getItemValue(item: T): unknown {
    if (item === null || item === undefined) return item;
    const valueFn = this.valueWith();
    if (typeof valueFn === 'function') {
      return valueFn(item);
    }
    if (typeof valueFn === 'string' && typeof item === 'object') {
      return (item as Record<string, unknown>)[valueFn];
    }
    if (typeof item === 'object') {
      const obj = item as Record<string, unknown>;
      if ('value' in obj) return obj['value'];
      if ('id' in obj) return obj['id'];
    }
    return item;
  }

  private computeHighlightParts(text: string, search: string): ChipHighlightPart[] {
    if (!search || !text) {
      return [{ text, matched: false }];
    }

    const regex = new RegExp(`(${this.escapeRegex(search)})`, 'gi');
    const segments = text.split(regex);

    return segments
      .filter((seg) => seg.length > 0)
      .map((seg) => ({
        text: seg,
        matched: seg.toLowerCase() === search.toLowerCase()
      }));
  }

  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // --- Interaction Handlers ---

  onContainerClick(event: MouseEvent): void {
    if (this.effectiveDisabled()) return;

    // Focus search input
    if (this.inputEl && !this.isMaxReached()) {
      this.inputEl.nativeElement.focus();
    }

    if (!this.isOpen() && this.options().length > 0) {
      this.openDropdown();
    }
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target.value;

    // Check if ends with separator (like comma)
    const separators = this.separatorKeys();
    for (const sep of separators) {
      if (sep !== 'Enter' && value.includes(sep)) {
        const parts = value.split(sep);
        for (const part of parts) {
          const trimmed = part.trim();
          if (trimmed) {
            this.addCustomChip(trimmed);
          }
        }
        this.inputValue.set('');
        target.value = '';
        this.emitSearch('');
        return;
      }
    }

    this.inputValue.set(value);
    this.emitSearch(value);

    if (!this.isOpen() && this.options().length > 0) {
      this.openDropdown();
    }
  }

  onFocus(): void {
    this.isInputFocused.set(true);
    if (this.openOnFocus() && !this.effectiveDisabled() && this.options().length > 0) {
      this.openDropdown();
    }
  }

  onBlur(): void {
    this.isInputFocused.set(false);
    this.markAsTouched();

    // If allowCustom is enabled and user left some text in the input, commit it as a chip
    if (this.allowCustom()) {
      const text = this.inputValue().trim();
      if (text) {
        this.addCustomChip(text);
        this.inputValue.set('');
        if (this.inputEl) {
          this.inputEl.nativeElement.value = '';
        }
      }
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    if (this.effectiveDisabled()) return;

    const opts = this.filteredOptions();
    const currentIdx = this.activeIndex();

    switch (event.key) {
      case 'ArrowDown': {
        event.preventDefault();
        if (!this.isOpen()) {
          this.openDropdown();
        } else if (opts.length > 0) {
          const nextIdx = currentIdx < opts.length - 1 ? currentIdx + 1 : 0;
          this.activeIndex.set(nextIdx);
          this.scrollActiveOptionIntoView(nextIdx);
        }
        break;
      }

      case 'ArrowUp': {
        event.preventDefault();
        if (!this.isOpen()) {
          this.openDropdown();
        } else if (opts.length > 0) {
          const prevIdx = currentIdx > 0 ? currentIdx - 1 : opts.length - 1;
          this.activeIndex.set(prevIdx);
          this.scrollActiveOptionIntoView(prevIdx);
        }
        break;
      }

      case 'Enter': {
        event.preventDefault();
        if (this.isOpen() && currentIdx >= 0 && currentIdx < opts.length) {
          const activeOpt = opts[currentIdx];
          this.toggleOption(activeOpt);
        } else if (this.allowCustom()) {
          const text = this.inputValue().trim();
          if (text) {
            this.addCustomChip(text);
            this.inputValue.set('');
            if (this.inputEl) {
              this.inputEl.nativeElement.value = '';
            }
          }
        }
        break;
      }

      case 'Backspace': {
        if (!this.inputValue() && this.selectedValues().length > 0 && this.removable()) {
          // Remove the last selected chip
          const current = [...this.selectedValues()];
          const removed = current.pop();
          this.selectedValues.set(current);
          this.emitSelection(current);
          this.chipRemove.emit(removed);
        }
        break;
      }

      case 'Escape': {
        if (this.isOpen()) {
          event.preventDefault();
          this.closeDropdown();
        }
        break;
      }

      case 'Tab': {
        if (this.isOpen()) {
          this.closeDropdown();
        }
        break;
      }
    }
  }

  toggleOption(option: FormattedChipOption<T>): void {
    if (this.effectiveDisabled() || option.disabled) return;

    const valToToggle = option.value;
    const currentValues = [...this.selectedValues()];
    const index = currentValues.findIndex((v) => v === valToToggle || v === option.item);

    if (index >= 0) {
      // Deselect
      currentValues.splice(index, 1);
      this.selectedValues.set(currentValues);
      this.emitSelection(currentValues);
      this.chipRemove.emit(valToToggle);
    } else {
      // Select (if not max reached)
      if (this.isMaxReached()) return;

      currentValues.push(valToToggle);
      this.selectedValues.set(currentValues);
      this.emitSelection(currentValues);
      this.chipAdd.emit(valToToggle);

      // Clear search input on selection
      this.inputValue.set('');
      if (this.inputEl) {
        this.inputEl.nativeElement.value = '';
      }
      this.emitSearch('');
    }

    // Keep focus in input
    if (this.inputEl && !this.isMaxReached()) {
      this.inputEl.nativeElement.focus();
    }
  }

  addCustomChip(text: string): void {
    if (!text || this.effectiveDisabled() || this.isMaxReached()) return;

    const currentValues = [...this.selectedValues()];
    // Prevent exact duplicates
    if (!currentValues.includes(text)) {
      currentValues.push(text);
      this.selectedValues.set(currentValues);
      this.emitSelection(currentValues);
      this.chipAdd.emit(text);
    }
  }

  removeChip(chipData: SelectedChipData): void {
    if (this.effectiveDisabled() || !this.removable()) return;

    const currentValues = this.selectedValues().filter(
      (v) => v !== chipData.value && v !== chipData.originalItem && v !== chipData.display
    );

    this.selectedValues.set(currentValues);
    this.emitSelection(currentValues);
    this.chipRemove.emit(chipData.value);

    // Refocus input if available
    if (this.inputEl && !this.isMaxReached()) {
      this.inputEl.nativeElement.focus();
    }
  }

  clearAll(event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    if (this.effectiveDisabled()) return;

    this.selectedValues.set([]);
    this.inputValue.set('');
    if (this.inputEl) {
      this.inputEl.nativeElement.value = '';
    }
    this.emitSelection([]);
    this.cleared.emit();
    this.emitSearch('');

    if (this.inputEl) {
      this.inputEl.nativeElement.focus();
    }
  }

  toggleDropdown(event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    if (this.effectiveDisabled()) return;

    if (this.isOpen()) {
      this.closeDropdown();
    } else {
      this.openDropdown();
      if (this.inputEl && !this.isMaxReached()) {
        this.inputEl.nativeElement.focus();
      }
    }
  }

  openDropdown(): void {
    if (this.isOpen() || this.effectiveDisabled()) return;
    this.isOpen.set(true);
    this.opened.emit();
  }

  closeDropdown(): void {
    if (!this.isOpen()) return;
    this.isOpen.set(false);
    this.activeIndex.set(-1);
    this.closed.emit();
  }

  onDocumentClick(event: MouseEvent): void {
    if (!this.isOpen()) return;
    const clickedInside = this.elementRef.nativeElement.contains(event.target as Node);
    if (!clickedInside) {
      this.closeDropdown();
      this.markAsTouched();
    }
  }

  private emitSearch(val: string): void {
    this.search.emit(val);
    this.searchChange.emit(val);
  }

  private emitSelection(values: unknown[]): void {
    this.onChange(values);
    this.selectionChange.emit(values);
    this.markAsTouched();
  }

  private markAsTouched(): void {
    if (!this.isTouched()) {
      this.isTouched.set(true);
      this.onTouched();
    }
  }

  private scrollActiveOptionIntoView(index: number): void {
    if (!this.dropdownEl) return;
    const optionEl = this.dropdownEl.nativeElement.querySelector(
      `#${this.componentId()}-option-${index}`
    ) as HTMLElement | null;

    if (optionEl) {
      optionEl.scrollIntoView({ block: 'nearest' });
    }
  }
}
