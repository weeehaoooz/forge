import {
  Component,
  ElementRef,
  ViewChild,
  computed,
  contentChildren,
  effect,
  forwardRef,
  inject,
  input,
  output,
  signal
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { OptionGroupComponent } from './option-group/option-group.component';
import { OptionComponent } from './option/option.component';

let uniqueIdCounter = 0;

@Component({
  selector: 'talos-select-input',
  templateUrl: './select-input.component.html',
  styleUrl: './select-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectInputComponent),
      multi: true
    }
  ],
  host: {
    'class': 'talos-select-host',
    '[class.is-open]': 'isOpen()',
    '[class.is-disabled]': 'effectiveDisabled()',
    '[class.select-sm]': 'size() === "sm"',
    '[class.select-md]': 'size() === "md"',
    '[class.select-lg]': 'size() === "lg"',
    '(keydown)': 'onKeyDown($event)',
    '(document:click)': 'onDocumentClick($event)'
  }
})
export class SelectInputComponent implements ControlValueAccessor {
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  // Signal Inputs
  readonly placeholder = input<string>('Select an option');
  readonly searchable = input<boolean>(false);
  readonly searchPlaceholder = input<string>('Search options...');
  readonly disabled = input<boolean>(false);
  readonly clearable = input<boolean>(false);
  readonly multiple = input<boolean>(false);
  readonly size = input<'sm' | 'md' | 'lg'>('sm');

  // Signal Outputs
  readonly selectionChange = output<unknown>();
  readonly opened = output<void>();
  readonly closed = output<void>();
  readonly searchChange = output<string>();

  // Content Queries
  readonly options = contentChildren(OptionComponent, { descendants: true });
  readonly optionGroups = contentChildren(OptionGroupComponent);

  // View Children
  @ViewChild('searchInput') searchInputEl?: ElementRef<HTMLInputElement>;
  @ViewChild('triggerEl') triggerEl?: ElementRef<HTMLDivElement>;

  // Component ID for ARIA attributes
  readonly componentId = `talos-select-${uniqueIdCounter++}`;
  readonly listboxId = `${this.componentId}-listbox`;

  // Internal Reactive State
  readonly value = signal<unknown>(null);
  readonly isOpen = signal<boolean>(false);
  readonly searchValue = signal<string>('');
  readonly focusedIndex = signal<number>(-1);
  readonly isDisabled = signal<boolean>(false);
  readonly isTouched = signal<boolean>(false);

  // Computed state
  readonly effectiveDisabled = computed(() => this.disabled() || this.isDisabled());

  readonly selectedOption = computed(() => {
    const currentVal = this.value();
    if (currentVal === null || currentVal === undefined) {
      return null;
    }
    return this.options().find((opt) => opt.value() === currentVal) ?? null;
  });

  readonly displayLabel = computed(() => {
    return this.selectedOption()?.displayText() ?? '';
  });

  readonly visibleOptions = computed(() => {
    return this.options().filter((opt) => !opt.hidden() && !opt.disabled());
  });

  // ControlValueAccessor Callbacks
  private onChange: (val: unknown) => void = () => { };
  private onTouched: () => void = () => { };

  constructor() {
    // Sync options' selected state when value or options list updates
    effect(() => {
      const opts = this.options();
      const currentVal = this.value();
      for (const opt of opts) {
        opt.isSelected.set(opt.value() === currentVal);
      }
    });

    // Subscribe to option click events
    effect((onCleanup) => {
      const opts = this.options();
      const subs = opts.map((opt) =>
        opt.selected.subscribe((selectedOpt) => {
          this.selectOption(selectedOpt);
        })
      );
      onCleanup(() => {
        subs.forEach((sub) => sub.unsubscribe());
      });
    });

    // Update active highlight when focusedIndex or options change
    effect(() => {
      const visibleOpts = this.visibleOptions();
      const index = this.focusedIndex();

      this.options().forEach((opt) => {
        const isActive = index >= 0 && visibleOpts[index] === opt;
        opt.isActive.set(isActive);
        if (isActive) {
          opt.scrollIntoViewIfNeeded();
        }
      });
    });
  }

  // --- ControlValueAccessor Interface ---
  writeValue(val: unknown): void {
    this.value.set(val);
  }

  registerOnChange(fn: (val: unknown) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  // --- Open / Close Controls ---
  toggleOpen(): void {
    if (this.effectiveDisabled()) return;
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  open(): void {
    if (this.effectiveDisabled() || this.isOpen()) return;
    this.isOpen.set(true);
    this.opened.emit();

    // Set initial keyboard focus index to selected option or first option
    const visibleOpts = this.visibleOptions();
    const selected = this.selectedOption();
    const selectedIdx = selected ? visibleOpts.indexOf(selected) : -1;
    this.focusedIndex.set(selectedIdx >= 0 ? selectedIdx : visibleOpts.length > 0 ? 0 : -1);

    if (this.searchable()) {
      setTimeout(() => {
        this.searchInputEl?.nativeElement.focus();
      }, 50);
    }
  }

  close(): void {
    if (!this.isOpen()) return;
    this.isOpen.set(false);
    this.focusedIndex.set(-1);
    this.clearSearch();
    this.markAsTouched();
    this.closed.emit();
  }

  // --- Selection Logic ---
  selectOption(option: OptionComponent | null): void {
    const newValue = option ? option.value() : null;
    this.value.set(newValue);
    this.onChange(newValue);
    this.selectionChange.emit(newValue);
    this.close();
  }

  onClear(event: MouseEvent): void {
    event.stopPropagation();
    if (this.effectiveDisabled()) return;
    this.selectOption(null);
  }

  markAsTouched(): void {
    if (!this.isTouched()) {
      this.isTouched.set(true);
      this.onTouched();
    }
  }

  // --- Search / Autocomplete Logic ---
  onSearchInput(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    this.searchValue.set(query);
    this.searchChange.emit(query);
    this.filterOptions(query);
  }

  clearSearch(): void {
    if (this.searchValue()) {
      this.searchValue.set('');
      this.searchChange.emit('');
      this.filterOptions('');
    }
  }

  private filterOptions(query: string): void {
    const term = query.toLowerCase().trim();
    for (const opt of this.options()) {
      if (!term) {
        opt.hidden.set(false);
      } else {
        const matches = opt.displayText().toLowerCase().includes(term);
        opt.hidden.set(!matches);
      }
    }
    const visibleOpts = this.visibleOptions();
    this.focusedIndex.set(visibleOpts.length > 0 ? 0 : -1);
  }

  // --- Keyboard & Document Click Event Handlers ---
  onKeyDown(event: KeyboardEvent): void {
    if (this.effectiveDisabled()) return;

    const visibleOpts = this.visibleOptions();
    const count = visibleOpts.length;
    const currentIdx = this.focusedIndex();

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!this.isOpen()) {
          this.open();
        } else if (count > 0) {
          const nextIdx = (currentIdx + 1) % count;
          this.focusedIndex.set(nextIdx);
        }
        break;

      case 'ArrowUp':
        event.preventDefault();
        if (!this.isOpen()) {
          this.open();
        } else if (count > 0) {
          const prevIdx = (currentIdx - 1 + count) % count;
          this.focusedIndex.set(prevIdx);
        }
        break;

      case 'Enter':
      case ' ':
        if (event.key === ' ' && this.searchable() && this.isOpen()) {
          // Allow space key inside search input
          return;
        }
        event.preventDefault();
        if (!this.isOpen()) {
          this.open();
        } else if (currentIdx >= 0 && currentIdx < count) {
          this.selectOption(visibleOpts[currentIdx]);
        }
        break;

      case 'Escape':
        if (this.isOpen()) {
          event.preventDefault();
          this.close();
          this.triggerEl?.nativeElement.focus();
        }
        break;

      case 'Home':
        if (this.isOpen() && count > 0) {
          event.preventDefault();
          this.focusedIndex.set(0);
        }
        break;

      case 'End':
        if (this.isOpen() && count > 0) {
          event.preventDefault();
          this.focusedIndex.set(count - 1);
        }
        break;

      case 'Tab':
        if (this.isOpen()) {
          this.close();
        }
        break;
    }
  }

  onDocumentClick(event: MouseEvent): void {
    if (this.isOpen() && !this.elementRef.nativeElement.contains(event.target as Node)) {
      this.close();
    }
  }
}
