import { Component, signal } from '@angular/core';
import {
  TalosButtonDirective,
  TalosButtonGroupComponent,
  TalosButtonGroupItemDirective,
  TalosTooltipDirective
} from '@talos/components';
import {
  LucideSparkles,
  LucidePlus,
  LucideTrash2,
  LucideCheck,
  LucideSend,
  LucideLayoutGrid,
  LucideRss,
  LucideLayers,
  LucideList,
  LucideBookmark,
  LucideChevronDown,
  LucidePencil,
  LucideCopy,
  LucideSmile,
  LucideMeh,
  LucideFrown,
  LucideGitFork,
  LucideStar,
  LucideInbox,
  LucideArchive,
  LucideAlignLeft,
  LucideAlignCenter,
  LucideAlignRight,
  LucideAlignJustify
} from '@lucide/angular';

@Component({
  selector: 'app-buttons-page',
  imports: [
    TalosButtonDirective,
    TalosButtonGroupComponent,
    TalosButtonGroupItemDirective,
    TalosTooltipDirective,
    LucideSparkles,
    LucidePlus,
    LucideTrash2,
    LucideCheck,
    LucideSend,
    LucideLayoutGrid,
    LucideRss,
    LucideLayers,
    LucideList,
    LucideBookmark,
    LucideChevronDown,
    LucidePencil,
    LucideCopy,
    LucideSmile,
    LucideMeh,
    LucideFrown,
    LucideGitFork,
    LucideStar,
    LucideInbox,
    LucideArchive,
    LucideAlignLeft,
    LucideAlignCenter,
    LucideAlignRight,
    LucideAlignJustify
  ],
  templateUrl: './buttons-page.html',
  styleUrl: './buttons-page.scss'
})
export class ButtonsPage {
  protected readonly isBtnLoading = signal<boolean>(false);

  // Button Group selection models
  protected readonly selectedView = signal<string>('stack');
  protected readonly selectedBilling = signal<string>('yearly');
  protected readonly selectedRating = signal<string>('smile');
  protected readonly selectedAlignment = signal<string>('center');
  protected readonly selectedMailFolder = signal<string>('inbox');

  toggleButtonLoading(): void {
    this.isBtnLoading.set(true);
    setTimeout(() => {
      this.isBtnLoading.set(false);
    }, 2000);
  }
}
