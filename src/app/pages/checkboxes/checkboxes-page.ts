import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ForgeCheckboxModule, ForgeButtonGroupModule } from '@forge/components';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-checkboxes-page',
  imports: [ReactiveFormsModule, ForgeCheckboxModule, ForgeButtonGroupModule, JsonPipe],
  templateUrl: './checkboxes-page.html',
  styleUrl: './checkboxes-page.scss'
})
export class CheckboxesPage {
  readonly checkboxForm = new FormGroup({
    acceptTerms: new FormControl<boolean>(true, Validators.requiredTrue),
    notificationsEnabled: new FormControl<boolean>(false),
    permissions: new FormControl<string[]>(['read', 'write']),
    features: new FormControl<string[]>(['dashboard', 'analytics'])
  });

  protected readonly inputSize = signal<'sm' | 'md' | 'lg'>('md');

  setInputSize(size: 'sm' | 'md' | 'lg'): void {
    this.inputSize.set(size);
  }
}
