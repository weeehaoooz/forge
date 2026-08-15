import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TalosSlideToggleModule, TalosButtonGroupModule } from '@talos/components';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-slide-toggle-page',
  imports: [ReactiveFormsModule, TalosSlideToggleModule, TalosButtonGroupModule, JsonPipe],
  templateUrl: './slide-toggle-page.html',
  styleUrl: './slide-toggle-page.scss'
})
export class SlideTogglePage {
  readonly toggleForm = new FormGroup({
    darkMode: new FormControl<boolean>(true),
    emailAlerts: new FormControl<boolean>(false),
    twoFactorAuth: new FormControl<boolean>(true),
    marketingEmails: new FormControl<boolean>(false)
  });

  protected readonly toggleSize = signal<'sm' | 'md' | 'lg'>('md');
  protected readonly standaloneValue = signal<boolean>(true);

  setToggleSize(size: 'sm' | 'md' | 'lg'): void {
    this.toggleSize.set(size);
  }

  toggleStandalone(): void {
    this.standaloneValue.update(val => !val);
  }
}
