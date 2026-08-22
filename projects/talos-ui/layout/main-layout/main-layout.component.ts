import { Component, inject } from '@angular/core';
import { LayoutService } from '../layout.service';
import { SidePanelComponent } from '../side-panel/side-panel.component';

@Component({
  selector: 'talos-main-layout',
  imports: [SidePanelComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
  host: {
    'class': 'talos-main-layout-host',
    '[class.left-nav-collapsed]': 'layoutService.isLeftNavCollapsed()',
    '[class.right-panel-open]': 'layoutService.isRightPanelOpen()',
    '[class.right-panel-inline]': 'layoutService.isRightPanelInline()',
    '[class.main-content-expanded]': 'layoutService.isMainContentExpanded()',
    '[class.blur-backdrop]': 'layoutService.shouldBlurMainContent()'
  }
})
export class MainLayoutComponent {
  protected readonly layoutService = inject(LayoutService);

  onBackdropClick(): void {
    if (this.layoutService.rightPanelOptions().closeOnBackdropClick) {
      this.layoutService.closeRightPanel();
    }
  }
}
