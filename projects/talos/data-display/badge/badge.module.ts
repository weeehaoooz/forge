import { NgModule } from '@angular/core';
import { TalosBadgeDirective } from './badge.directive';

@NgModule({
  imports: [TalosBadgeDirective],
  exports: [TalosBadgeDirective]
})
export class TalosBadgeModule {}
