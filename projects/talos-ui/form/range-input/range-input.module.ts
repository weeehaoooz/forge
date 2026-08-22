import { NgModule } from '@angular/core';
import { TalosRangeInputComponent } from './range-input.component';
import { TalosRangeInputDirective } from './range-input.directive';

@NgModule({
  imports: [TalosRangeInputComponent, TalosRangeInputDirective],
  exports: [TalosRangeInputComponent, TalosRangeInputDirective]
})
export class TalosRangeInputModule { }
