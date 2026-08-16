import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  TalosCardComponent,
  TalosCardHeaderComponent,
  TalosCardBodyComponent,
  TalosCardFooterComponent,
  TalosCardAvatarDirective,
  TalosCardActionsDirective,
  TalosCardMediaDirective,
  TalosCardVariant,
  TalosCardPadding,
  TalosCardFooterAlign,
  TalosButtonDirective,
  TalosButtonGroupComponent,
  TalosButtonGroupItemDirective,
  TalosSlideToggleComponent,
  TalosStatusTagComponent
} from '@talos/components';
import {
  LucideEye,
  LucideCode,
  LucideCopy,
  LucideCheck,
  LucideMoreVertical,
  LucideDollarSign,
  LucideUsers,
  LucideSparkles,
  LucideArrowRight,
  LucideMail,
  LucideCheckCircle2,
  LucideBookmark,
  LucideShare2,
  LucideExternalLink
} from '@lucide/angular';

@Component({
  selector: 'app-cards-page',
  imports: [
    CommonModule,
    FormsModule,
    TalosCardComponent,
    TalosCardHeaderComponent,
    TalosCardBodyComponent,
    TalosCardFooterComponent,
    TalosCardAvatarDirective,
    TalosCardActionsDirective,
    TalosCardMediaDirective,
    TalosButtonDirective,
    TalosButtonGroupComponent,
    TalosButtonGroupItemDirective,
    TalosSlideToggleComponent,
    TalosStatusTagComponent,
    LucideEye,
    LucideCode,
    LucideCopy,
    LucideCheck,
    LucideMoreVertical,
    LucideDollarSign,
    LucideUsers,
    LucideSparkles,
    LucideArrowRight,
    LucideMail,
    LucideCheckCircle2,
    LucideBookmark,
    LucideShare2,
    LucideExternalLink
  ],
  templateUrl: './cards-page.html',
  styleUrl: './cards-page.scss'
})
export class CardsPage {
  // Playground State
  readonly activeTab = signal<'preview' | 'code'>('preview');
  readonly selectedVariant = signal<TalosCardVariant>('elevated');
  readonly selectedPadding = signal<TalosCardPadding>('md');
  readonly footerAlign = signal<TalosCardFooterAlign>('end');
  readonly headerBordered = signal<boolean>(true);
  readonly footerBordered = signal<boolean>(true);
  readonly isHoverable = signal<boolean>(true);
  readonly isClickable = signal<boolean>(false);
  readonly isSelected = signal<boolean>(false);
  readonly isDisabled = signal<boolean>(false);
  readonly showAvatar = signal<boolean>(true);
  readonly customTitle = signal<string>('Talos System Architecture');
  readonly customSubtitle = signal<string>('Infrastructure health and telemetry dashboard');

  readonly clickCount = signal<number>(0);
  readonly copied = signal<boolean>(false);

  // Selected Plan for Interactive Selectable Grid
  readonly selectedPlan = signal<string>('pro');

  readonly codeSnippet = computed(() => {
    const v = this.selectedVariant();
    const p = this.selectedPadding();
    const fa = this.footerAlign();
    const hb = this.headerBordered();
    const fb = this.footerBordered();
    const hov = this.isHoverable();
    const clk = this.isClickable();
    const sel = this.isSelected();
    const dis = this.isDisabled();

    return `<talos-card
  variant="${v}"
  padding="${p}"
  [hoverable]="${hov}"
  [clickable]="${clk}"
  [selected]="${sel}"
  [disabled]="${dis}">

  <talos-card-header
    title="${this.customTitle()}"
    subtitle="${this.customSubtitle()}"
    [bordered]="${hb}">
    <div talosCardAvatar class="avatar-box">TS</div>
    <div talosCardActions>
      <button type="button" talosButton variant="ghost" size="sm" [iconOnly]="true">
        <svg lucideMoreVertical [size]="16"></svg>
      </button>
    </div>
  </talos-card-header>

  <talos-card-body>
    <p>
      Talos cards provide structured, accessible surfaces with clear visual hierarchy,
      supporting modular headers, customizable body content, and action footers.
    </p>
  </talos-card-body>

  <talos-card-footer [bordered]="${fb}" align="${fa}">
    <button type="button" talosButton variant="outline" size="sm">Cancel</button>
    <button type="button" talosButton variant="primary" size="sm">Deploy Changes</button>
  </talos-card-footer>
</talos-card>`;
  });

  onPlaygroundClick(): void {
    if (this.isClickable()) {
      this.clickCount.update(c => c + 1);
    }
  }

  copyCode(): void {
    navigator.clipboard.writeText(this.codeSnippet());
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 2000);
  }
}
