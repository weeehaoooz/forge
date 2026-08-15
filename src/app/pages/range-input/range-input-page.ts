import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  ForgeRangeInputComponent,
  ForgeButtonDirective,
  ForgeButtonGroupComponent,
  ForgeButtonGroupItemDirective,
  ForgeSlideToggleComponent,
  RangeInputSize,
  RangeInputVariant,
  RangeInputValue,
  RangeInputChangeEvent,
  RangeInputMark
} from '@forge/components';
import {
  LucideEye,
  LucideCode,
  LucideCopy,
  LucideCheck
} from '@lucide/angular';

@Component({
  selector: 'app-range-input-page',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ForgeRangeInputComponent,
    ForgeButtonDirective,
    ForgeButtonGroupComponent,
    ForgeButtonGroupItemDirective,
    ForgeSlideToggleComponent,
    LucideEye,
    LucideCode,
    LucideCopy,
    LucideCheck
  ],
  templateUrl: './range-input-page.html',
  styleUrl: './range-input-page.scss'
})
export class RangeInputPage {
  // Tab control: 'preview' | 'code'
  protected readonly activeTab = signal<'preview' | 'code'>('preview');
  protected readonly copied = signal<boolean>(false);

  // 1. Basic Single Slider State
  protected readonly singleValue = signal<number>(45);

  // 2. Dual Range Price Selector State
  protected readonly priceRange = signal<[number, number]>([150, 650]);

  // 3. Step & Interval Configurations
  protected readonly stepValue = signal<number>(20);
  protected readonly customMarks: RangeInputMark[] = [
    { value: 0, label: 'Free' },
    { value: 25, label: '$25/mo' },
    { value: 50, label: 'Pro ($50)' },
    { value: 75, label: 'Business' },
    { value: 100, label: 'Enterprise' }
  ];

  // 4. Reactive Form with Synchronized Inputs
  protected readonly formGroup = new FormGroup({
    budget: new FormControl<[number, number]>([2000, 8000]),
    volume: new FormControl<number>(65)
  });

  // 5. Interactive Playground State
  protected readonly pgValue = signal<RangeInputValue>(50);
  protected readonly pgMin = signal<number>(0);
  protected readonly pgMax = signal<number>(100);
  protected readonly pgStep = signal<number>(5);
  protected readonly pgInterval = signal<number>(20);
  protected readonly pgRange = signal<boolean>(false);
  protected readonly pgSize = signal<RangeInputSize>('md');
  protected readonly pgVariant = signal<RangeInputVariant>('primary');
  protected readonly pgShowTicks = signal<boolean>(true);
  protected readonly pgShowIntervals = signal<boolean>(true);
  protected readonly pgShowInputs = signal<boolean>(false);
  protected readonly pgDisabled = signal<boolean>(false);
  protected readonly pgSnapToTicks = signal<boolean>(false);
  protected readonly lastEventLog = signal<string>('Drag thumbs or type in inputs to see live events.');

  readonly codeSnippet = `<!-- 1. Basic Single Slider with Step & Intervals -->
<forge-range-input
  label="Brightness Level"
  hint="Adjust screen backlight brightness"
  [min]="0"
  [max]="100"
  [step]="5"
  [interval]="25"
  [showTicks]="true"
  [showIntervals]="true"
  suffix="%"
  [(value)]="brightness"
/>

<!-- 2. Dual Range Price Slider with Currency Prefix & Inputs -->
<forge-range-input
  label="Price Range Filter"
  [min]="0"
  [max]="1000"
  [step]="10"
  [interval]="200"
  [range]="true"
  [showTicks]="true"
  [showIntervals]="true"
  [showInputs]="true"
  prefix="$"
  [(value)]="priceRange"
/>

<!-- 3. Reactive Forms Integration (CVA) -->
<forge-range-input
  formControlName="budget"
  label="Monthly Cloud Budget"
  [min]="500"
  [max]="10000"
  [step]="250"
  [interval]="2500"
  [range]="true"
  [showTicks]="true"
  [showIntervals]="true"
  prefix="$"
  variant="success"
/>

<!-- 4. Custom Discrete Ticks & Labels with Snapping -->
<forge-range-input
  label="Subscription Tier"
  [marks]="[
    { value: 0, label: 'Free' },
    { value: 25, label: '$25/mo' },
    { value: 50, label: 'Pro ($50)' },
    { value: 75, label: 'Business' },
    { value: 100, label: 'Enterprise' }
  ]"
  [snapToTicks]="true"
  [showTicks]="true"
  [showIntervals]="true"
  variant="primary"
/>`;

  onRangeChange(event: RangeInputChangeEvent): void {
    const val = Array.isArray(event.value)
      ? `[${event.value[0]}, ${event.value[1]}]`
      : event.value;
    this.lastEventLog.set(`Event '${event.source}': Value = ${val}`);
  }

  toggleDualMode(isDual: boolean): void {
    this.pgRange.set(isDual);
    if (isDual) {
      this.pgValue.set([20, 80]);
    } else {
      this.pgValue.set(50);
    }
  }

  copyCode(): void {
    navigator.clipboard.writeText(this.codeSnippet);
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 2000);
  }
}
