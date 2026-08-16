import { NgModule } from '@angular/core';
import { TalosChipsComponent } from './chips/chips.component';
import { TalosChipComponent } from './chip/chip.component';

@NgModule({
  imports: [TalosChipsComponent, TalosChipComponent],
  exports: [TalosChipsComponent, TalosChipComponent]
})
export class TalosChipsModule {}
