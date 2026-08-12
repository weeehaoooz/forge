import { Component, signal } from '@angular/core';
import { ForgeButtonDirective } from '@forge/components';
import { LucideSparkles, LucidePlus, LucideTrash2, LucideCheck, LucideSend } from '@lucide/angular';

@Component({
  selector: 'app-buttons-page',
  imports: [ForgeButtonDirective, LucideSparkles, LucidePlus, LucideTrash2, LucideCheck, LucideSend],
  templateUrl: './buttons-page.html',
  styleUrl: './buttons-page.scss'
})
export class ButtonsPage {
  protected readonly isBtnLoading = signal<boolean>(false);

  toggleButtonLoading(): void {
    this.isBtnLoading.set(true);
    setTimeout(() => {
      this.isBtnLoading.set(false);
    }, 2000);
  }
}
