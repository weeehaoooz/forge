import { Component, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  ForgeRadioDirective,
  ForgeRadioGroupComponent,
  ForgeRadioComponent,
  ForgeRadioModule,
  ForgeButtonGroupModule,
  RadioSize,
  RadioVariant,
  RadioDirection
} from '@forge/components';

@Component({
  selector: 'app-radio-page',
  imports: [ReactiveFormsModule, ForgeRadioModule, ForgeButtonGroupModule, JsonPipe],
  templateUrl: './radio-page.html',
  styleUrl: './radio-page.scss'
})
export class RadioPage {
  readonly radioForm = new FormGroup({
    billingPlan: new FormControl<string>('pro', { nonNullable: true, validators: [Validators.required] }),
    communicationPref: new FormControl<string>('email', { nonNullable: true }),
    themeMode: new FormControl<string>('system', { nonNullable: true })
  });

  protected readonly radioSize = signal<RadioSize>('md');
  protected readonly radioVariant = signal<RadioVariant>('primary');
  protected readonly radioDirection = signal<RadioDirection>('vertical');

  // Standalone native radio model
  protected readonly standaloneValue = signal<string>('option2');

  setRadioSize(size: RadioSize): void {
    this.radioSize.set(size);
  }

  setRadioVariant(variant: RadioVariant): void {
    this.radioVariant.set(variant);
  }

  setRadioDirection(direction: RadioDirection): void {
    this.radioDirection.set(direction);
  }
}
