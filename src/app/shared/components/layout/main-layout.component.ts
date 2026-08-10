import { Component, inject } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { LayoutService } from './layout.service';

@Component({
  selector: 'app-main-layout',
  imports: [NgComponentOutlet],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
  host: {
    'class': 'app-main-layout-host',
    '[class.left-nav-collapsed]': 'layoutService.isLeftNavCollapsed()',
    '[class.right-panel-open]': 'layoutService.isRightPanelOpen()',
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
