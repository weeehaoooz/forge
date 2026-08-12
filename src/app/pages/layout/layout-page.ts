import { Component, inject } from '@angular/core';
import { ForgeButtonDirective, LayoutService } from '@forge/components';
import { SampleDetailPanelComponent } from '../../demo/sample-detail-panel.component';

@Component({
  selector: 'app-layout-page',
  imports: [ForgeButtonDirective],
  templateUrl: './layout-page.html',
  styleUrl: './layout-page.scss'
})
export class LayoutPage {
  protected readonly layoutService = inject(LayoutService);

  openDetailWithBlur(title: string, id: string): void {
    this.layoutService.openRightPanel(
      SampleDetailPanelComponent,
      {
        subjectId: id,
        subjectTitle: title,
        subjectData: {
          category: 'Frontend Framework',
          status: 'Active',
          lastInspected: new Date().toISOString(),
          requestedBy: 'User Admin'
        }
      },
      {
        title: `Detail: ${title}`,
        width: '420px',
        blurBackdrop: true,
        closeOnBackdropClick: true
      }
    );
  }

  openDetailNoBlur(title: string, id: string): void {
    this.layoutService.openRightPanel(
      SampleDetailPanelComponent,
      {
        subjectId: id,
        subjectTitle: title,
        subjectData: {
          category: 'Backend Framework',
          status: 'Stable',
          lastInspected: new Date().toISOString()
        }
      },
      {
        title: `Detail: ${title}`,
        width: '380px',
        mode: 'overlay',
        blurBackdrop: false
      }
    );
  }

  openDetailInline(title: string, id: string): void {
    this.layoutService.openRightPanel(
      SampleDetailPanelComponent,
      {
        subjectId: id,
        subjectTitle: title,
        subjectData: {
          category: 'Inline Data Panel',
          status: 'Pushing Content',
          lastInspected: new Date().toISOString()
        }
      },
      {
        title: `Inline: ${title}`,
        width: '400px',
        mode: 'inline'
      }
    );
  }
}
