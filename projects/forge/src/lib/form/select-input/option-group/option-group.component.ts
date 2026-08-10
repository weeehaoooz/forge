import { Component, contentChildren, input } from '@angular/core';
import { OptionComponent } from '../option/option.component';

@Component({
  selector: 'forge-option-group',
  templateUrl: './option-group.component.html',
  styleUrl: './option-group.component.scss',
  host: {
    'role': 'group',
    '[attr.aria-label]': 'label()',
    '[class.forge-option-group]': 'true',
    '[class.app-option-group]': 'true',
    '[class.is-disabled]': 'disabled()'
  }
})
export class OptionGroupComponent {
  readonly label = input.required<string>();
  readonly disabled = input<boolean>(false);

  readonly options = contentChildren(OptionComponent);
}
