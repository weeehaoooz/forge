import { Component, ViewEncapsulation, computed, inject } from '@angular/core';
import { TalosSnackbarComponent } from './snackbar.component';
import { TalosSnackbarService } from './snackbar.service';
import { TalosSnackbarInstance, TalosSnackbarPosition } from './snackbar.types';

@Component({
  selector: 'talos-snackbar-container',
  imports: [TalosSnackbarComponent],
  template: `
    @for (pos of positions; track pos) {
      @if (groupedSnackbars()[pos].length > 0) {
        <div class="talos-snackbar-position-group" [class]="pos">
          @for (item of groupedSnackbars()[pos]; track item.id) {
            <talos-snackbar
              [instance]="item"
              (dismiss)="onDismiss($event)"
              (action)="onAction($event)"
            />
          }
        </div>
      }
    }
  `,
  styleUrl: './snackbar-container.component.scss',
  encapsulation: ViewEncapsulation.None,
  host: {
    'class': 'talos-snackbar-overlay-host'
  }
})
export class TalosSnackbarContainerComponent {
  private readonly snackbarService = inject(TalosSnackbarService);

  readonly positions: TalosSnackbarPosition[] = [
    'top-left',
    'top-center',
    'top-right',
    'bottom-left',
    'bottom-center',
    'bottom-right'
  ];

  readonly groupedSnackbars = computed<Record<TalosSnackbarPosition, TalosSnackbarInstance[]>>(() => {
    const all = this.snackbarService.snackbars();
    const map: Record<TalosSnackbarPosition, TalosSnackbarInstance[]> = {
      'top-left': [],
      'top-center': [],
      'top-right': [],
      'bottom-left': [],
      'bottom-center': [],
      'bottom-right': []
    };

    for (const item of all) {
      const pos = item.position || 'bottom-right';
      if (map[pos]) {
        map[pos].push(item);
      } else {
        map['bottom-right'].push(item);
      }
    }

    return map;
  });

  onDismiss(id: string): void {
    this.snackbarService.dismiss(id);
  }

  onAction(id: string): void {
    // Action handled inside component and service
  }
}
