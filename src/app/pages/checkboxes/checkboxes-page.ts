import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ForgeCheckboxDirective } from '@forge/components';

@Component({
  selector: 'app-checkboxes-page',
  imports: [ReactiveFormsModule, ForgeCheckboxDirective],
  templateUrl: './checkboxes-page.html',
  styleUrl: './checkboxes-page.scss'
})
export class CheckboxesPage {
  readonly checkboxForm = new FormGroup({
    acceptTerms: new FormControl<boolean>(true, Validators.requiredTrue),
    notificationsEnabled: new FormControl<boolean>(false)
  });

  protected readonly inputSize = signal<'sm' | 'md' | 'lg'>('sm');

  setInputSize(size: 'sm' | 'md' | 'lg'): void {
    this.inputSize.set(size);
  }
}
