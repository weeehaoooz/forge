import { NgModule } from '@angular/core';
import { TalosButtonGroupComponent } from './button-group/button-group.component';
import { TalosButtonGroupItemDirective } from './button-group-item/button-group-item.directive';
import { TalosTooltipDirective, TalosTooltipComponent } from '@talos/components/tooltip';
import { TalosButtonDirective } from '@talos/components/button';

@NgModule({
  imports: [
    TalosButtonGroupComponent,
    TalosButtonGroupItemDirective,
    TalosTooltipDirective,
    TalosTooltipComponent,
    TalosButtonDirective
  ],
  exports: [
    TalosButtonGroupComponent,
    TalosButtonGroupItemDirective,
    TalosTooltipDirective,
    TalosTooltipComponent,
    TalosButtonDirective
  ]
})
export class TalosButtonGroupModule { }
