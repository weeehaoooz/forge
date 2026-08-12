import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { describe, beforeEach, it, expect } from 'vitest';
import { ForgeCheckboxDirective, CheckboxSize, CheckboxVariant } from './checkbox.directive';

@Component({
  imports: [ForgeCheckboxDirective, ReactiveFormsModule],
  template: `
    <input
      id="test-checkbox"
      type="checkbox"
      forgeCheckbox
      [formControl]="checkboxControl"
      [size]="checkboxSize()"
      [variant]="checkboxVariant()"
      [invalid]="isInvalid()"
      [indeterminate]="isIndeterminate()"
    />
  `
})
class TestHostComponent {
  checkboxControl = new FormControl<boolean>(false);
  checkboxSize = signal<CheckboxSize>('md');
  checkboxVariant = signal<CheckboxVariant>('primary');
  isInvalid = signal<boolean>(false);
  isIndeterminate = signal<boolean>(false);
}

describe('ForgeCheckboxDirective Suite', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should apply base forge-checkbox class', () => {
    const checkboxEl = fixture.nativeElement.querySelector('#test-checkbox') as HTMLInputElement;
    expect(checkboxEl.classList.contains('forge-checkbox')).toBe(true);
  });

  it('should apply size classes dynamically', () => {
    const checkboxEl = fixture.nativeElement.querySelector('#test-checkbox') as HTMLInputElement;

    expect(checkboxEl.classList.contains('checkbox-md')).toBe(true);

    hostComponent.checkboxSize.set('sm');
    fixture.detectChanges();
    expect(checkboxEl.classList.contains('checkbox-sm')).toBe(true);

    hostComponent.checkboxSize.set('lg');
    fixture.detectChanges();
    expect(checkboxEl.classList.contains('checkbox-lg')).toBe(true);
  });

  it('should apply color variant classes dynamically', () => {
    const checkboxEl = fixture.nativeElement.querySelector('#test-checkbox') as HTMLInputElement;

    expect(checkboxEl.classList.contains('forge-checkbox-primary')).toBe(true);

    hostComponent.checkboxVariant.set('secondary');
    fixture.detectChanges();
    expect(checkboxEl.classList.contains('forge-checkbox-secondary')).toBe(true);

    hostComponent.checkboxVariant.set('success');
    fixture.detectChanges();
    expect(checkboxEl.classList.contains('forge-checkbox-success')).toBe(true);

    hostComponent.checkboxVariant.set('danger');
    fixture.detectChanges();
    expect(checkboxEl.classList.contains('forge-checkbox-danger')).toBe(true);
  });

  it('should apply is-invalid class when invalid is true', () => {
    const checkboxEl = fixture.nativeElement.querySelector('#test-checkbox') as HTMLInputElement;

    expect(checkboxEl.classList.contains('is-invalid')).toBe(false);

    hostComponent.isInvalid.set(true);
    fixture.detectChanges();
    expect(checkboxEl.classList.contains('is-invalid')).toBe(true);
  });

  it('should apply indeterminate state and property when indeterminate is true', () => {
    const checkboxEl = fixture.nativeElement.querySelector('#test-checkbox') as HTMLInputElement;

    expect(checkboxEl.indeterminate).toBe(false);
    expect(checkboxEl.classList.contains('is-indeterminate')).toBe(false);

    hostComponent.isIndeterminate.set(true);
    fixture.detectChanges();

    expect(checkboxEl.indeterminate).toBe(true);
    expect(checkboxEl.classList.contains('is-indeterminate')).toBe(true);
  });

  it('should bind properly with reactive forms', () => {
    const checkboxEl = fixture.nativeElement.querySelector('#test-checkbox') as HTMLInputElement;

    expect(checkboxEl.checked).toBe(false);

    hostComponent.checkboxControl.setValue(true);
    fixture.detectChanges();

    expect(checkboxEl.checked).toBe(true);
  });
});
