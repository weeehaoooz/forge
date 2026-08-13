import { Component, ViewEncapsulation, computed, inject } from '@angular/core';
import { ForgeSnackbarComponent } from './snackbar.component';
import { ForgeSnackbarService } from './snackbar.service';
import { ForgeSnackbarInstance, ForgeSnackbarPosition } from './snackbar.types';

@Component({
  selector: 'forge-snackbar-container',
  imports: [ForgeSnackbarComponent],
  template: `
    @for (pos of positions; track pos) {
      @if (groupedSnackbars()[pos].length > 0) {
        <div class="forge-snackbar-position-group" [class]="pos">
          @for (item of groupedSnackbars()[pos]; track item.id) {
            <forge-snackbar
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
    'class': 'forge-snackbar-overlay-host'
  }
})
export class ForgeSnackbarContainerComponent {
  private readonly snackbarService = inject(ForgeSnackbarService);

  readonly positions: ForgeSnackbarPosition[] = [
    'top-left',
    'top-center',
    'top-right',
    'bottom-left',
    'bottom-center',
    'bottom-right'
  ];

  readonly groupedSnackbars = computed<Record<ForgeSnackbarPosition, ForgeSnackbarInstance[]>>(() => {
    const all = this.snackbarService.snackbars();
    const map: Record<ForgeSnackbarPosition, ForgeSnackbarInstance[]> = {
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
