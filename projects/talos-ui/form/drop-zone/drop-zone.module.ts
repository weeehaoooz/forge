import { NgModule } from '@angular/core';
import { TalosDropZoneComponent } from './drop-zone.component';
import { TalosFileDropDirective } from './drop-zone.directive';

@NgModule({
  imports: [TalosDropZoneComponent, TalosFileDropDirective],
  exports: [TalosDropZoneComponent, TalosFileDropDirective]
})
export class TalosDropZoneModule {}
