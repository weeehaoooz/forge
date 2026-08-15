import { NgModule } from '@angular/core';
import { ForgeRangeInputComponent } from './range-input.component';
import { ForgeRangeInputDirective } from './range-input.directive';

@NgModule({
  imports: [ForgeRangeInputComponent, ForgeRangeInputDirective],
  exports: [ForgeRangeInputComponent, ForgeRangeInputDirective]
})
export class ForgeRangeInputModule {}
