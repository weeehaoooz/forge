import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { describe, beforeEach, it, expect } from 'vitest';
import { TalosRadioGroupComponent, RadioDirection } from './radio-group.component';
import { TalosRadioComponent } from './radio.component';
import { RadioSize, RadioVariant } from './radio.directive';

@Component({
  imports: [TalosRadioGroupComponent, TalosRadioComponent, ReactiveFormsModule],
  template: `
    <talos-radio-group
      [formControl]="control"
      [size]="groupSize()"
      [variant]="groupVariant()"
      [direction]="groupDirection()"
    >
      <talos-radio id="radio-opt-1" value="opt1">Option 1</talos-radio>
      <talos-radio id="radio-opt-2" value="opt2">Option 2</talos-radio>
      <talos-radio id="radio-opt-3" value="opt3" [disabled]="true">Option 3 (Disabled)</talos-radio>
    </talos-radio-group>
  `
})
class TestGroupHostComponent {
  control = new FormControl<string>('opt1');
  groupSize = signal<RadioSize>('md');
  groupVariant = signal<RadioVariant>('primary');
  groupDirection = signal<RadioDirection>('vertical');
}

describe('TalosRadioGroupComponent Suite', () => {
  let fixture: ComponentFixture<TestGroupHostComponent>;
  let hostComponent: TestGroupHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestGroupHostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestGroupHostComponent);
    hostComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render group with radiogroup role and default direction', () => {
    const groupEl = fixture.nativeElement.querySelector('talos-radio-group') as HTMLElement;
    expect(groupEl.getAttribute('role')).toBe('radiogroup');
    expect(groupEl.classList.contains('direction-vertical')).toBe(true);
  });

  it('should update direction dynamically', () => {
    const groupEl = fixture.nativeElement.querySelector('talos-radio-group') as HTMLElement;
    hostComponent.groupDirection.set('horizontal');
    fixture.detectChanges();
    expect(groupEl.classList.contains('direction-horizontal')).toBe(true);
  });

  it('should reflect initial FormControl value on child radio', () => {
    const opt1Input = fixture.nativeElement.querySelector('#radio-opt-1 input') as HTMLInputElement;
    const opt2Input = fixture.nativeElement.querySelector('#radio-opt-2 input') as HTMLInputElement;

    expect(opt1Input.checked).toBe(true);
    expect(opt2Input.checked).toBe(false);
  });

  it('should update FormControl value when a radio is clicked', () => {
    const opt2Input = fixture.nativeElement.querySelector('#radio-opt-2 input') as HTMLInputElement;
    opt2Input.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(hostComponent.control.value).toBe('opt2');
  });

  it('should not update value when clicking disabled radio option', () => {
    const opt3Input = fixture.nativeElement.querySelector('#radio-opt-3 input') as HTMLInputElement;
    expect(opt3Input.disabled).toBe(true);

    opt3Input.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(hostComponent.control.value).toBe('opt1');
  });

  it('should navigate enabled options with ArrowDown key', () => {
    const groupEl = fixture.nativeElement.querySelector('talos-radio-group') as HTMLElement;

    groupEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    fixture.detectChanges();

    expect(hostComponent.control.value).toBe('opt2');
  });

  it('should skip disabled option when navigating with ArrowDown key', () => {
    hostComponent.control.setValue('opt2');
    fixture.detectChanges();

    const groupEl = fixture.nativeElement.querySelector('talos-radio-group') as HTMLElement;
    groupEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    fixture.detectChanges();

    // Option 3 is disabled, so it wraps back to Option 1
    expect(hostComponent.control.value).toBe('opt1');
  });

  it('should disable all options when FormControl is disabled', () => {
    hostComponent.control.disable();
    fixture.detectChanges();

    const opt1Input = fixture.nativeElement.querySelector('#radio-opt-1 input') as HTMLInputElement;
    const opt2Input = fixture.nativeElement.querySelector('#radio-opt-2 input') as HTMLInputElement;

    expect(opt1Input.disabled).toBe(true);
    expect(opt2Input.disabled).toBe(true);
  });
});
