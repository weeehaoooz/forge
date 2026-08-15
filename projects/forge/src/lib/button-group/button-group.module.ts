import { NgModule } from '@angular/core';
import { ForgeButtonGroupComponent } from './button-group.component';
import { ForgeButtonGroupItemDirective } from './button-group-item.directive';
import { ForgeTooltipDirective, ForgeTooltipComponent } from '@forge/components/tooltip';
import { ForgeButtonDirective } from '@forge/components/button';

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
