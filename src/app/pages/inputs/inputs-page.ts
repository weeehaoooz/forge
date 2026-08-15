import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TalosInputDirective, TalosButtonDirective, TalosButtonGroupModule } from '@talos/components';

@Component({
  selector: 'app-inputs-page',
  imports: [ReactiveFormsModule, TalosInputDirective, TalosButtonDirective, TalosButtonGroupModule],
  templateUrl: './inputs-page.html',
  styleUrl: './inputs-page.scss'
})
export class InputsPage {
  readonly inputsForm = new FormGroup({
    projectName: new FormControl<string>('', Validators.required),
    projectDescription: new FormControl<string>('')
  });

  protected readonly inputSize = signal<'sm' | 'md' | 'lg'>('sm');
  protected readonly isFormDisabled = signal<boolean>(false);

  setInputSize(size: 'sm' | 'md' | 'lg'): void {
    this.inputSize.set(size);
  }

  toggleDisableForm(): void {
    const nextState = !this.isFormDisabled();
    this.isFormDisabled.set(nextState);
    if (nextState) {
      this.inputsForm.disable();
    } else {
      this.inputsForm.enable();
    }
  }
}
