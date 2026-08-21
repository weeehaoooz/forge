import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  TalosBadgeDirective,
  TalosBadgePosition,
  TalosBadgeSize,
  TalosBadgeVariant,
  TalosButtonDirective,
  TalosCardComponent,
  TalosCardHeaderComponent,
  TalosCardTitleDirective,
  TalosCardSubtitleDirective,
  TalosCardBodyComponent
} from '@talos/components';
import {
  LucideBell,
  LucideMail,
  LucideShoppingCart,
  LucideMessageSquare,
  LucideUser,
  LucidePlus,
  LucideMinus,
  LucideRotateCcw
} from '@lucide/angular';

@Component({
  selector: 'app-badge-page',
  imports: [
    FormsModule,
    TalosBadgeDirective,
    TalosButtonDirective,
    TalosCardComponent,
    TalosCardHeaderComponent,
    TalosCardTitleDirective,
    TalosCardSubtitleDirective,
    TalosCardBodyComponent,
    LucideBell,
    LucideMail,
    LucideShoppingCart,
    LucideMessageSquare,
    LucideUser,
    LucidePlus,
    LucideMinus,
    LucideRotateCcw
  ],
  templateUrl: './badge-page.html',
  styleUrl: './badge-page.scss'
})
export class BadgePage {
  // Playground interactive state
  readonly playgroundValue = signal<number>(120);
  readonly playgroundMax = signal<number>(99);
  readonly playgroundSize = signal<TalosBadgeSize>('md');
  readonly playgroundPosition = signal<TalosBadgePosition>('top-right');
  readonly playgroundVariant = signal<TalosBadgeVariant>('danger');
  readonly playgroundDot = signal<boolean>(false);
  readonly playgroundPulse = signal<boolean>(true);
  readonly playgroundHidden = signal<boolean>(false);
  readonly playgroundOverlap = signal<boolean>(true);

  // Dynamic counter demo
  readonly counterValue = signal<number>(8);
  readonly counterMax = signal<number>(9);

  // Copy state
  readonly copiedSnippet = signal<boolean>(false);

  // Available options
  readonly sizes: TalosBadgeSize[] = ['xs', 'sm', 'md', 'lg'];
  readonly positions: TalosBadgePosition[] = [
    'top-right',
    'top-left',
    'bottom-right',
    'bottom-left',
    'inline'
  ];
  readonly variants: TalosBadgeVariant[] = [
    'primary',
    'danger',
    'success',
    'warning',
    'info',
    'neutral',
    'subtle',
    'outline'
  ];

  incrementCounter(): void {
    this.counterValue.update((v) => v + 1);
  }

  decrementCounter(): void {
    this.counterValue.update((v) => (v > 0 ? v - 1 : 0));
  }

  resetCounter(): void {
    this.counterValue.set(0);
  }

  copyCode(code: string): void {
    navigator.clipboard.writeText(code);
    this.copiedSnippet.set(true);
    setTimeout(() => this.copiedSnippet.set(false), 2000);
  }
}
