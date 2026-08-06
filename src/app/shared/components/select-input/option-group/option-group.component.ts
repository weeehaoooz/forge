import { Component, contentChildren, input } from '@angular/core';
import { OptionComponent } from '../option/option.component';

@Component({
  selector: 'app-option-group',
  templateUrl: './option-group.component.html',
  styleUrl: './option-group.component.scss',
  host: {
    'role': 'group',
    '[attr.aria-label]': 'label()',
    '[class.app-option-group]': 'true',
    '[class.is-disabled]': 'disabled()'
  }
})
export class OptionGroupComponent {
  readonly label = input.required<string>();
  readonly disabled = input<boolean>(false);

  readonly options = contentChildren(OptionComponent);
}
