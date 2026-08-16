import { Component, inject, input, output } from '@angular/core';
import { CheckboxDirection, TalosCheckboxGroupDirective } from './checkbox-group.directive';
import { CheckboxSize, CheckboxVariant } from './checkbox.directive';

@Component({
  selector: 'talos-checkbox-group',
  template: '<ng-content></ng-content>',
  hostDirectives: [
    {
      directive: TalosCheckboxGroupDirective,
      inputs: ['name', 'size', 'variant', 'direction', 'disabled', 'invalid'],
      outputs: ['valueChange']
    }
  ]
})
export class TalosCheckboxGroupComponent {
  readonly groupDir = inject(TalosCheckboxGroupDirective, { self: true });

  // Inputs forwarded via hostDirectives or component bindings
  readonly name = input<string>(this.groupDir.name());
  readonly size = input<CheckboxSize>('md');
  readonly variant = input<CheckboxVariant>('primary');
  readonly direction = input<CheckboxDirection>('vertical');
  readonly disabled = input<boolean>(false);
  readonly invalid = input<boolean>(false);

  readonly valueChange = output<any[]>();
}
