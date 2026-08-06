import {
  Component,
  ElementRef,
  computed,
  inject,
  input,
  output,
  signal
} from '@angular/core';

@Component({
  selector: 'app-option',
  templateUrl: './option.component.html',
  styleUrl: './option.component.scss',
  host: {
    'role': 'option',
    '[attr.aria-selected]': 'isSelected()',
    '[attr.aria-disabled]': 'disabled()',
    '[attr.tabindex]': '-1',
    '[class.app-option]': 'true',
    '[class.is-selected]': 'isSelected()',
    '[class.is-active]': 'isActive()',
    '[class.is-disabled]': 'disabled()',
    '[class.is-hidden]': 'hidden()',
    '(click)': 'onClick($event)'
  }
})
export class OptionComponent {
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  readonly value = input<unknown>(null);
  readonly label = input<string | undefined>(undefined);
  readonly disabled = input<boolean>(false);

  readonly selected = output<OptionComponent>();

  readonly isSelected = signal<boolean>(false);
  readonly isActive = signal<boolean>(false);
  readonly hidden = signal<boolean>(false);

  readonly displayText = computed<string>(() => {
    const customLabel = this.label();
    if (customLabel !== undefined && customLabel !== null) {
      return customLabel;
    }
    const nativeText = this.elementRef.nativeElement.textContent?.trim();
    if (nativeText) {
      return nativeText;
    }
    const val = this.value();
    return val !== null && val !== undefined ? String(val) : '';
  });

  onClick(event: MouseEvent): void {
    event.stopPropagation();
    if (this.disabled() || this.hidden()) {
      return;
    }
    this.selected.emit(this);
  }

  scrollIntoViewIfNeeded(): void {
    if (typeof this.elementRef.nativeElement.scrollIntoView === 'function') {
      this.elementRef.nativeElement.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth'
      });
    }
  }
}
