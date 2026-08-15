import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { describe, beforeEach, it, expect } from 'vitest';
import { TalosRadioDirective, RadioSize, RadioVariant } from './radio.directive';

@Component({
  imports: [TalosRadioDirective, ReactiveFormsModule],
  template: `
    <input
      id="test-radio"
      type="radio"
      name="test-group"
      value="option1"
      talosRadio
      [formControl]="radioControl"
      [size]="radioSize()"
      [variant]="radioVariant()"
      [invalid]="isInvalid()"
    />
  `
})
class TestDirectiveHostComponent {
  radioControl = new FormControl<string>('option1');
  radioSize = signal<RadioSize>('md');
  radioVariant = signal<RadioVariant>('primary');
  isInvalid = signal<boolean>(false);
}

describe('TalosRadioDirective Suite', () => {
  let fixture: ComponentFixture<TestDirectiveHostComponent>;
  let hostComponent: TestDirectiveHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestDirectiveHostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestDirectiveHostComponent);
    hostComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should apply base talos-radio class', () => {
    const radioEl = fixture.nativeElement.querySelector('#test-radio') as HTMLInputElement;
    expect(radioEl.classList.contains('talos-radio')).toBe(true);
  });

  it('should apply size classes dynamically', () => {
    const radioEl = fixture.nativeElement.querySelector('#test-radio') as HTMLInputElement;

    expect(radioEl.classList.contains('radio-md')).toBe(true);

    hostComponent.radioSize.set('sm');
    fixture.detectChanges();
    expect(radioEl.classList.contains('radio-sm')).toBe(true);

    hostComponent.radioSize.set('lg');
    fixture.detectChanges();
    expect(radioEl.classList.contains('radio-lg')).toBe(true);
  });

  it('should apply color variant classes dynamically', () => {
    const radioEl = fixture.nativeElement.querySelector('#test-radio') as HTMLInputElement;

    expect(radioEl.classList.contains('talos-radio-primary')).toBe(true);

    hostComponent.radioVariant.set('secondary');
    fixture.detectChanges();
    expect(radioEl.classList.contains('talos-radio-secondary')).toBe(true);

    hostComponent.radioVariant.set('success');
    fixture.detectChanges();
    expect(radioEl.classList.contains('talos-radio-success')).toBe(true);

    hostComponent.radioVariant.set('danger');
    fixture.detectChanges();
    expect(radioEl.classList.contains('talos-radio-danger')).toBe(true);
  });

  it('should apply is-invalid class when invalid is true', () => {
    const radioEl = fixture.nativeElement.querySelector('#test-radio') as HTMLInputElement;

    expect(radioEl.classList.contains('is-invalid')).toBe(false);

    hostComponent.isInvalid.set(true);
    fixture.detectChanges();
    expect(radioEl.classList.contains('is-invalid')).toBe(true);
  });

  it('should reflect form control value', () => {
    const radioEl = fixture.nativeElement.querySelector('#test-radio') as HTMLInputElement;

    expect(radioEl.checked).toBe(true);

    hostComponent.radioControl.setValue('option2');
    fixture.detectChanges();
    expect(radioEl.checked).toBe(false);
  });
});
