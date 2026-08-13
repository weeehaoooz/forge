import { NgModule } from '@angular/core';
import { ForgeButtonGroupComponent } from './button-group.component';
import { ForgeButtonGroupItemDirective } from './button-group-item.directive';
import { ForgeTooltipDirective, ForgeTooltipComponent } from '../tooltip/tooltip.directive';
import { ForgeButtonDirective } from '../button/button.directive';

@NgModule({
  imports: [
    ForgeButtonGroupComponent,
    ForgeButtonGroupItemDirective,
    ForgeTooltipDirective,
    ForgeTooltipComponent,
    ForgeButtonDirective
  ],
  exports: [
    ForgeButtonGroupComponent,
    ForgeButtonGroupItemDirective,
    ForgeTooltipDirective,
    ForgeTooltipComponent,
    ForgeButtonDirective
  ]
})
export class ForgeButtonGroupModule {}
