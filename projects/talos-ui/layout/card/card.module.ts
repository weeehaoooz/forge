import { NgModule } from '@angular/core';
import { TalosCardComponent } from './card.component';
import { TalosCardHeaderComponent } from './card-header.component';
import { TalosCardBodyComponent } from './card-body.component';
import { TalosCardFooterComponent } from './card-footer.component';
import {
  TalosCardActionsDirective,
  TalosCardAvatarDirective,
  TalosCardMediaDirective,
  TalosCardSubtitleDirective,
  TalosCardTitleDirective
} from './card.directives';

const CARD_DECLARATIONS = [
  TalosCardComponent,
  TalosCardHeaderComponent,
  TalosCardBodyComponent,
  TalosCardFooterComponent,
  TalosCardTitleDirective,
  TalosCardSubtitleDirective,
  TalosCardAvatarDirective,
  TalosCardActionsDirective,
  TalosCardMediaDirective
];

@NgModule({
  imports: [...CARD_DECLARATIONS],
  exports: [...CARD_DECLARATIONS]
})
export class TalosCardModule {}
