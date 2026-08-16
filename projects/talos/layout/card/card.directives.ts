import { Directive } from '@angular/core';

@Directive({
  selector: 'talos-card-title, [talosCardTitle]',
  host: {
    'class': 'talos-card-title'
  }
})
export class TalosCardTitleDirective {}

@Directive({
  selector: 'talos-card-subtitle, [talosCardSubtitle]',
  host: {
    'class': 'talos-card-subtitle'
  }
})
export class TalosCardSubtitleDirective {}

@Directive({
  selector: '[talosCardAvatar], [talosCardIcon]',
  host: {
    'class': 'talos-card-avatar'
  }
})
export class TalosCardAvatarDirective {}

@Directive({
  selector: 'talos-card-actions, [talosCardActions]',
  host: {
    'class': 'talos-card-actions'
  }
})
export class TalosCardActionsDirective {}

@Directive({
  selector: 'talos-card-media, [talosCardMedia]',
  host: {
    'class': 'talos-card-media'
  }
})
export class TalosCardMediaDirective {}
