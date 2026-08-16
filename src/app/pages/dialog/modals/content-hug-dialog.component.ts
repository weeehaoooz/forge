import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  TalosDialogModule
} from '@talos/components/dialog';
import { TalosButtonDirective } from '@talos/components/button';
import { TalosChipComponent } from '@talos/components/form/chips';
import { LucideSparkles, LucideFolderPlus } from '@lucide/angular';

@Component({
  selector: 'app-content-hug-dialog',
  imports: [
    CommonModule,
    TalosDialogModule,
    TalosButtonDirective,
    TalosChipComponent,
    LucideSparkles,
    LucideFolderPlus
  ],
  template: `
    <talos-dialog-header
      title="Dynamic Content Hugger"
      subtitle="This dialog size is set to 'auto'. It hugs and expands seamlessly as items change.">
      <div talos-dialog-icon class="dialog-icon-badge">
        <svg lucideSparkles [size]="20"></svg>
      </div>
    </talos-dialog-header>

    <talos-dialog-content padding="md">
      <div class="content-hug-box">
        <p class="desc-text">
          Current active tags count: <strong>{{ tags().length }}</strong>
        </p>

        <div class="dynamic-chips-grid">
          @for (tag of tags(); track tag) {
            <talos-chip [label]="tag" color="primary" [removable]="true" (removed)="removeTag(tag)" />
          }
        </div>

        <div class="hug-action-bar">
          <button talosButton variant="outline" size="sm" (click)="addTag()">
            <svg lucideFolderPlus [size]="14"></svg>
            Add New Item
          </button>
        </div>
      </div>
    </talos-dialog-content>

    <talos-dialog-footer align="end">
      <button talosButton variant="primary" size="md" [talosDialogClose]="tags()">
        Done ({{ tags().length }} items)
      </button>
    </talos-dialog-footer>
  `,
  styles: [`
    .dialog-icon-badge {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2.25rem;
      height: 2.25rem;
      border-radius: 0.5rem;
      background: var(--talos-primary-light, #eff6ff);
      color: var(--talos-primary-color, #2563eb);
    }
    .content-hug-box {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .desc-text {
      margin: 0;
      font-size: 0.875rem;
      color: var(--talos-text-muted, #64748b);
    }
    .dynamic-chips-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      max-width: 440px;
    }
    .hug-action-bar {
      margin-top: 0.5rem;
    }
  `]
})
export class ContentHugDialogComponent {
  protected readonly tags = signal<string[]>([
    'High Availability',
    'Redis Cache',
    'Postgres Cluster',
    'Kafka Stream'
  ]);

  private count = 1;

  protected addTag(): void {
    this.tags.update(t => [...t, `Dynamic Microservice #${this.count++}`]);
  }

  protected removeTag(tag: string): void {
    this.tags.update(t => t.filter(item => item !== tag));
  }
}
