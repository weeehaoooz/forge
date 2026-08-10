import { Component, input, inject } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { LayoutService } from '@forge/components';

@Component({
  selector: 'app-sample-detail-panel',
  imports: [JsonPipe],
  template: `
    <div class="subject-detail-panel">
      <div class="badge">Subject ID: {{ subjectId() }}</div>
      <h4>{{ subjectTitle() }}</h4>
      <p class="description">
        This component was injected dynamically into the layout's right panel via
        <code>LayoutService.openRightPanel()</code>!
      </p>

      <div class="data-box">
        <span class="label">Payload Data:</span>
        <pre>{{ subjectData() | json }}</pre>
      </div>

      <div class="actions">
        <button type="button" class="btn btn-secondary" (click)="close()">
          Close Panel
        </button>
      </div>
    </div>
  `,
  styles: [`
    .subject-detail-panel {
      display: flex;
      flex-direction: column;
      gap: 16px;
      font-family: inherit;
    }
    .badge {
      align-self: flex-start;
      padding: 4px 8px;
      border-radius: 4px;
      background: #e0f2fe;
      color: #0369a1;
      font-size: 12px;
      font-weight: 600;
    }
    h4 {
      margin: 0;
      font-size: 18px;
      color: #0f172a;
    }
    .description {
      margin: 0;
      font-size: 14px;
      color: #475569;
      line-height: 1.5;
    }
    .data-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 12px;
      .label {
        font-size: 12px;
        font-weight: 600;
        color: #64748b;
      }
      pre {
        margin: 6px 0 0 0;
        font-size: 13px;
        color: #0f172a;
      }
    }
    .actions {
      margin-top: 12px;
      display: flex;
      justify-content: flex-end;
    }
    .btn {
      padding: 8px 16px;
      border-radius: 6px;
      font-size: 14px;
      cursor: pointer;
      border: 1px solid #cbd5e1;
      background: #ffffff;
      color: #334155;
      &:hover {
        background: #f1f5f9;
      }
    }
  `]
})
export class SampleDetailPanelComponent {
  private readonly layoutService = inject(LayoutService);

  readonly subjectId = input<string>('SUB-001');
  readonly subjectTitle = input<string>('Sample Subject Information');
  readonly subjectData = input<Record<string, unknown>>({});

  close(): void {
    this.layoutService.closeRightPanel();
  }
}
