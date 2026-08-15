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
  AutocompleteDisplayFn,
  AutocompleteFilterFn,
  AutocompleteHighlightPart,
  AutocompleteItemContext,
  AutocompleteSize,
  AutocompleteValueFn,
  FormattedAutocompleteOption
} from './autocomplete.types';

let uniqueAutocompleteIdCounter = 0;

@Component({
  selector: 'forge-autocomplete',
  imports: [NgTemplateOutlet],
  templateUrl: './autocomplete.component.html',
  styleUrl: './autocomplete.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ForgeAutocompleteComponent),
      multi: true
    }
  ],
  host: {
    'class': 'forge-autocomplete-host',
    '[class.is-open]': 'isOpen()',
    '[class.is-disabled]': 'effectiveDisabled()',
    '[class.is-searching]': 'effectiveSearching()',
    '[class.autocomplete-sm]': 'size() === "sm"',
    '[class.autocomplete-md]': 'size() === "md"',
    '[class.autocomplete-lg]': 'size() === "lg"',
    '(document:click)': 'onDocumentClick($event)'
  }
})
export class ForgeAutocompleteComponent<T = unknown> implements ControlValueAccessor {
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  // Signal Inputs
  readonly options = input<readonly T[] | T[]>([]);
  readonly searching = input<boolean>(false);
  readonly loading = input<boolean>(false);
  readonly placeholder = input<string>('Search...');
  readonly disabled = input<boolean>(false);
  readonly clearable = input<boolean>(true);
  readonly size = input<AutocompleteSize>('sm');
  readonly minChars = input<number>(0);
  readonly displayWith = input<AutocompleteDisplayFn<T> | keyof T | null>(null);
  readonly valueWith = input<AutocompleteValueFn<T> | keyof T | null>(null);
  readonly filterFn = input<AutocompleteFilterFn<T> | null | undefined>(undefined);
  readonly highlightMatch = input<boolean>(true);
  readonly noResultsText = input<string>('No matching results');
  readonly searchingText = input<string>('Searching...');
  readonly itemTemplate = input<TemplateRef<AutocompleteItemContext<T>> | null>(null);
  readonly openOnFocus = input<boolean>(true);
  readonly id = input<string>('');

  // Signal Outputs
  readonly searchChange = output<string>();
  readonly selectionChange = output<T | null>();
  readonly opened = output<void>();
  readonly closed = output<void>();
  readonly cleared = output<void>();

  // View Children
  @ViewChild('inputEl') inputEl?: ElementRef<HTMLInputElement>;
  @ViewChild('dropdownEl') dropdownEl?: ElementRef<HTMLDivElement>;

  // Component IDs for ARIA attributes
  private readonly autoId = `forge-autocomplete-${uniqueAutocompleteIdCounter++}`;
  readonly componentId = computed(() => this.id() || this.autoId);
  readonly inputId = computed(() => `${this.componentId()}-input`);
  readonly listboxId = computed(() => `${this.componentId()}-listbox`);

  // Internal Reactive State
  readonly inputValue = signal<string>('');
  readonly selectedItem = signal<T | null>(null);
  readonly isOpen = signal<boolean>(false);
  readonly focusedIndex = signal<number>(-1);
  readonly isCvaDisabled = signal<boolean>(false);
  readonly isTouched = signal<boolean>(false);

  // Computed state
  readonly effectiveDisabled = computed(() => this.disabled() || this.isCvaDisabled());
  readonly effectiveSearching = computed(() => this.searching() || this.loading());

  // Formatted and Filtered Options
  readonly formattedOptions = computed<FormattedAutocompleteOption<T>[]>(() => {
    const rawOptions = this.options() || [];
    const query = this.inputValue().trim();
    const minCharCount = this.minChars();
    const customFilter = this.filterFn();
    const isHighlight = this.highlightMatch();

    // If query is below minChars threshold, return empty
    if (query.length < minCharCount) {
      return [];
    }

    // Filter raw items
    let filteredList: T[];
    if (customFilter === null) {
      // Bypasses internal filtering (user controls search results completely, e.g. remote API)
      filteredList = [...rawOptions];
    } else if (typeof customFilter === 'function') {
      filteredList = rawOptions.filter((item) => customFilter(item, query));
    } else {
      // Default label text filtering
      if (!query) {
        filteredList = [...rawOptions];
      } else {
        const lowerQuery = query.toLowerCase();
        filteredList = rawOptions.filter((item) => {
          const label = this.getDisplayLabel(item);
          return label.toLowerCase().includes(lowerQuery);
        });
      }
    }

    // Map to formatted structure with highlight parts
    return filteredList.map((item, index) => {
      const label = this.getDisplayLabel(item);
      const val = this.extractValue(item);
      const parts = isHighlight && query ? this.computeHighlightParts(label, query) : [{ text: label, isMatch: false }];

      return {
        id: `${this.componentId()}-opt-${index}`,
        label,
        value: val,
        raw: item,
        highlightParts: parts
      };
    });
  });

  readonly activeOptionId = computed(() => {
    const index = this.focusedIndex();
    const options = this.formattedOptions();
    if (index >= 0 && index < options.length) {
      return options[index].id;
    }
    return undefined;
  });

  // ControlValueAccessor Callbacks
  private onChange: (val: unknown) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    // Reset focused index when formatted options change
    effect(() => {
      this.formattedOptions();
      this.focusedIndex.set(-1);
    });
  }

  // Label & Value Helpers
  getDisplayLabel(item: T | null): string {
    if (item === null || item === undefined) {
      return '';
    }
    if (typeof item === 'string' || typeof item === 'number') {
      return String(item);
    }
    const displayWithFn = this.displayWith();
    if (typeof displayWithFn === 'function') {
      return displayWithFn(item);
    }
    if (typeof displayWithFn === 'string' && item && typeof item === 'object' && displayWithFn in item) {
      return String((item as Record<string, unknown>)[displayWithFn] ?? '');
    }
    if (item && typeof item === 'object') {
      const record = item as Record<string, unknown>;
      if ('label' in record) return String(record['label'] ?? '');
      if ('name' in record) return String(record['name'] ?? '');
      if ('title' in record) return String(record['title'] ?? '');
      if ('text' in record) return String(record['text'] ?? '');
    }
    return String(item);
  }

  extractValue(item: T | null): unknown {
    if (item === null || item === undefined) {
      return null;
    }
    const valueWithFn = this.valueWith();
    if (typeof valueWithFn === 'function') {
      return valueWithFn(item);
    }
    if (typeof valueWithFn === 'string' && item && typeof item === 'object' && valueWithFn in item) {
      return (item as Record<string, unknown>)[valueWithFn];
    }
    if (item && typeof item === 'object') {
      const record = item as Record<string, unknown>;
      if ('value' in record) return record['value'];
      if ('id' in record) return record['id'];
      if ('key' in record) return record['key'];
    }
    return item;
  }

  private computeHighlightParts(text: string, query: string): AutocompleteHighlightPart[] {
    if (!text || !query) {
      return [{ text, isMatch: false }];
    }
    const parts: AutocompleteHighlightPart[] = [];
    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();
    let startIndex = 0;

    while (startIndex < text.length) {
      const matchIndex = lowerText.indexOf(lowerQuery, startIndex);
      if (matchIndex === -1) {
        parts.push({ text: text.substring(startIndex), isMatch: false });
        break;
      }

      if (matchIndex > startIndex) {
        parts.push({ text: text.substring(startIndex, matchIndex), isMatch: false });
      }

      const matchEnd = matchIndex + query.length;
      parts.push({ text: text.substring(matchIndex, matchEnd), isMatch: true });
      startIndex = matchEnd;
    }

    return parts;
  }

  // Input & Event Handlers
  onInput(event: Event): void {
    if (this.effectiveDisabled()) return;

    const value = (event.target as HTMLInputElement).value;
    this.inputValue.set(value);

    // If typing doesn't match selected item label, clear selected reference
    if (this.selectedItem()) {
      const currentLabel = this.getDisplayLabel(this.selectedItem());
      if (value !== currentLabel) {
        this.selectedItem.set(null);
        this.onChange(null);
        this.selectionChange.emit(null);
      }
    }

    if (!this.isOpen() && value.length >= this.minChars()) {
      this.openDropdown();
    }

    this.searchChange.emit(value);
  }

  onFocus(): void {
    if (this.effectiveDisabled()) return;

    if (this.openOnFocus() && this.inputValue().length >= this.minChars()) {
      this.openDropdown();
    }
  }

  onBlur(): void {
    this.markAsTouched();
  }

  onInputClick(): void {
    if (this.effectiveDisabled()) return;

    if (!this.isOpen() && this.inputValue().length >= this.minChars()) {
      this.openDropdown();
    }
  }

  onTriggerClick(): void {
    if (this.effectiveDisabled()) return;

    if (this.isOpen()) {
      this.closeDropdown();
    } else {
      this.openDropdown();
      this.inputEl?.nativeElement.focus();
    }
  }

  onClear(event: MouseEvent): void {
    event.stopPropagation();
    event.preventDefault();

    if (this.effectiveDisabled()) return;

    this.inputValue.set('');
    this.selectedItem.set(null);
    this.focusedIndex.set(-1);

    this.onChange(null);
    this.selectionChange.emit(null);
    this.searchChange.emit('');
    this.cleared.emit();

    if (this.inputEl) {
      this.inputEl.nativeElement.value = '';
      this.inputEl.nativeElement.focus();
    }

    if (this.minChars() > 0) {
      this.closeDropdown();
    }
  }

  selectOption(opt: FormattedAutocompleteOption<T>, event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    this.selectedItem.set(opt.raw);
    this.inputValue.set(opt.label);

    if (this.inputEl) {
      this.inputEl.nativeElement.value = opt.label;
    }

    this.onChange(opt.value);
    this.selectionChange.emit(opt.raw);
    this.closeDropdown();
  }

  onKeyDown(event: KeyboardEvent): void {
    if (this.effectiveDisabled()) return;

    const options = this.formattedOptions();
    const optionCount = options.length;

    switch (event.key) {
      case 'ArrowDown': {
        event.preventDefault();
        if (!this.isOpen()) {
          this.openDropdown();
          this.focusedIndex.set(0);
        } else if (optionCount > 0) {
          const nextIndex = (this.focusedIndex() + 1) % optionCount;
          this.focusedIndex.set(nextIndex);
          this.scrollToFocusedOption(nextIndex);
        }
        break;
      }
      case 'ArrowUp': {
        event.preventDefault();
        if (!this.isOpen()) {
          this.openDropdown();
          this.focusedIndex.set(optionCount - 1);
        } else if (optionCount > 0) {
          const prevIndex = this.focusedIndex() <= 0 ? optionCount - 1 : this.focusedIndex() - 1;
          this.focusedIndex.set(prevIndex);
          this.scrollToFocusedOption(prevIndex);
        }
        break;
      }
      case 'Enter': {
        if (this.isOpen() && this.focusedIndex() >= 0 && this.focusedIndex() < optionCount) {
          event.preventDefault();
          this.selectOption(options[this.focusedIndex()]);
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

  private scrollToFocusedOption(index: number): void {
    if (!this.dropdownEl) return;
    const optionEls = this.dropdownEl.nativeElement.querySelectorAll<HTMLElement>('.autocomplete-option');
    if (optionEls[index] && typeof optionEls[index].scrollIntoView === 'function') {
      optionEls[index].scrollIntoView({ block: 'nearest' });
    }
  }

  openDropdown(): void {
    if (this.effectiveDisabled() || this.isOpen()) return;
    this.isOpen.set(true);
    this.opened.emit();
  }

  closeDropdown(): void {
    if (!this.isOpen()) return;
    this.isOpen.set(false);
    this.focusedIndex.set(-1);
    this.closed.emit();
  }

  onDocumentClick(event: MouseEvent): void {
    const target = event.target as Node;
    if (!this.elementRef.nativeElement.contains(target)) {
      this.closeDropdown();
    }
  }

  private markAsTouched(): void {
    if (!this.isTouched()) {
      this.isTouched.set(true);
      this.onTouched();
    }
  }

  // ControlValueAccessor Implementation
  writeValue(value: unknown): void {
    if (value === null || value === undefined || value === '') {
      this.selectedItem.set(null);
      this.inputValue.set('');
      if (this.inputEl) {
        this.inputEl.nativeElement.value = '';
      }
      return;
    }

    // Try matching among options
    const rawOptions = this.options() || [];
    const matched = rawOptions.find((opt) => {
      const extracted = this.extractValue(opt);
      return extracted === value || opt === value;
    });

    if (matched !== undefined) {
      this.selectedItem.set(matched);
      const label = this.getDisplayLabel(matched);
      this.inputValue.set(label);
      if (this.inputEl) {
        this.inputEl.nativeElement.value = label;
      }
    } else {
      // If primitive string value provided directly
      if (typeof value === 'string' || typeof value === 'number') {
        this.selectedItem.set(value as unknown as T);
        this.inputValue.set(String(value));
        if (this.inputEl) {
          this.inputEl.nativeElement.value = String(value);
        }
      }
    }
  }

  registerOnChange(fn: (val: unknown) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isCvaDisabled.set(isDisabled);
    if (isDisabled) {
      this.closeDropdown();
    }
  }
}
