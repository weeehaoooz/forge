import {
  Component,
  ElementRef,
  ViewChild,
  ChangeDetectorRef,
  computed,
  inject,
  input
} from '@angular/core';
import { TalosRadioDirective, RadioSize, RadioVariant } from './radio.directive';
import { TalosRadioGroupComponent } from './radio-group.component';

let radioOptionCounter = 0;

@Component({
  selector: 'talos-radio',
  imports: [TalosRadioDirective],
  template: `
    <label class="talos-radio-wrapper" [class.is-disabled]="effectiveDisabled()" [class.is-checked]="checked()">
      <input
        #radioInput
        type="radio"
        talosRadio
        [id]="elementId()"
        [name]="effectiveName()"
        [size]="effectiveSize()"
        [variant]="effectiveVariant()"
        [checked]="checked()"
        [disabled]="effectiveDisabled()"
        (change)="onRadioChange($event)"
      />
      <span class="talos-radio-label">
        <ng-content></ng-content>
      </span>
    </label>
  `,
  host: {
    'class': 'talos-radio-host'
  }
})
export class TalosRadioComponent {
  private readonly radioGroup = inject(TalosRadioGroupComponent, { optional: true });
  private readonly cdr = inject(ChangeDetectorRef);

  @ViewChild('radioInput') radioInputEl?: ElementRef<HTMLInputElement>;

  // Signal Inputs
  readonly value = input.required<unknown>();
  readonly disabled = input<boolean>(false);
  readonly size = input<RadioSize | undefined>(undefined);
  readonly variant = input<RadioVariant | undefined>(undefined);
  readonly id = input<string>('');

  // Internal Unique ID
  private readonly defaultId = `talos-radio-opt-${++radioOptionCounter}`;
  readonly elementId = computed(() => this.id() || this.defaultId);

  // Cascading properties from group or standalone defaults
  readonly effectiveName = computed(() => this.radioGroup?.name() || 'talos-radio');
  readonly effectiveSize = computed(() => this.size() ?? this.radioGroup?.size() ?? 'md');
  readonly effectiveVariant = computed(() => this.variant() ?? this.radioGroup?.variant() ?? 'primary');
  readonly effectiveDisabled = computed(() => this.disabled() || (this.radioGroup?.effectiveDisabled() ?? false));

  // Selection state
  readonly checked = computed(() => {
    if (!this.radioGroup) return false;
    return this.radioGroup.value() === this.value();
  });

  onRadioChange(event: Event): void {
    if (this.effectiveDisabled()) return;
    if (this.radioGroup) {
      this.radioGroup.selectValue(this.value());
    }
  }

  focusInput(): void {
    this.radioInputEl?.nativeElement.focus();
  }

  markForCheck(): void {
    this.cdr.markForCheck();
  }
}
