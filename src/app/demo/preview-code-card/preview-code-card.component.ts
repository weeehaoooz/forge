import { Component, computed, input, model, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TalosButtonDirective } from '@talos/components/button';
import { TalosButtonGroupComponent, TalosButtonGroupItemDirective } from '@talos/components/button-group';
import {
  LucideEye,
  LucideCode,
  LucideCopy,
  LucideCheck
} from '@lucide/angular';

export interface DemoCodeTab {
  label: string;
  code: string;
  lang?: string;
}

@Component({
  selector: 'talos-preview-code-card, [talosPreviewCodeCard]',
  imports: [
    CommonModule,
    TalosButtonDirective,
    TalosButtonGroupComponent,
    TalosButtonGroupItemDirective,
    LucideEye,
    LucideCode,
    LucideCopy,
    LucideCheck
  ],
  templateUrl: './preview-code-card.component.html',
  styleUrl: './preview-code-card.component.scss',
  host: {
    'class': 'talos-preview-code-card-host'
  }
})
export class TalosPreviewCodeCardComponent {
  /** Card heading title */
  readonly title = input<string>('');

  /** Optional explanatory subtitle */
  readonly subtitle = input<string>('');

  /** Small pill badge in header (e.g. 'Interactive', 'Angular CDK', etc.) */
  readonly badge = input<string>('');

  /** Single code snippet string (shortcut) */
  readonly code = input<string>('');

  /** Optional explicit TypeScript code */
  readonly tsCode = input<string>('');

  /** Optional explicit HTML code */
  readonly htmlCode = input<string>('');

  /** Optional explicit SCSS / CSS code */
  readonly scssCode = input<string>('');

  /** Multiple customizable code tabs */
  readonly tabs = input<DemoCodeTab[]>([]);

  /** Inner preview padding size */
  readonly previewPadding = input<'none' | 'sm' | 'md' | 'lg'>('md');

  /** Active view mode ('preview' or 'code') */
  readonly activeMode = model<'preview' | 'code'>('preview');

  /** Currently selected code sub-tab index */
  readonly activeSubTab = signal<number>(0);

  /** Copied feedback animation state */
  readonly copied = signal<boolean>(false);

  // Resolved list of code tabs
  protected readonly resolvedTabs = computed<DemoCodeTab[]>(() => {
    const customTabs = this.tabs();
    if (customTabs && customTabs.length > 0) {
      return customTabs;
    }

    const result: DemoCodeTab[] = [];
    if (this.tsCode()) {
      result.push({ label: 'TypeScript', code: this.tsCode(), lang: 'ts' });
    }
    if (this.htmlCode()) {
      result.push({ label: 'HTML', code: this.htmlCode(), lang: 'html' });
    }
    if (this.scssCode()) {
      result.push({ label: 'SCSS', code: this.scssCode(), lang: 'scss' });
    }
    if (this.code() && result.length === 0) {
      result.push({ label: 'Code', code: this.code(), lang: 'ts' });
    }
    return result;
  });

  protected readonly currentCodeSnippet = computed<string>(() => {
    const allTabs = this.resolvedTabs();
    if (allTabs.length === 0) {
      return this.code() || '// No code provided';
    }
    const idx = Math.min(this.activeSubTab(), allTabs.length - 1);
    return allTabs[idx]?.code || '';
  });

  protected copyCurrentCode(): void {
    const text = this.currentCodeSnippet();
    navigator.clipboard?.writeText(text);
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 2000);
  }
}
