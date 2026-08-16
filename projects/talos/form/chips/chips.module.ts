import { NgModule } from '@angular/core';
import { TalosChipsComponent } from './chips.component';
import { TalosChipComponent } from './chip.component';

@NgModule({
  imports: [TalosChipsComponent, TalosChipComponent],
  exports: [TalosChipsComponent, TalosChipComponent]
})
export class TalosChipsModule {}
