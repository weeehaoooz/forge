import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { describe, beforeEach, it, expect } from 'vitest';
import { SelectInputComponent } from './select-input.component';
import { OptionComponent } from '../option/option.component';
import { OptionGroupComponent } from '../option-group/option-group.component';

@Component({
  imports: [SelectInputComponent, OptionComponent, OptionGroupComponent, ReactiveFormsModule],
  template: `
    <talos-select-input
      [formControl]="control"
      [label]="label()"
      [floating]="floating()"
      [placeholder]="placeholder()"
      [searchable]="searchable()"
      [clearable]="clearable()"
    >
      <talos-option value="apple">Apple</talos-option>
      <talos-option value="banana">Banana</talos-option>
      <talos-option value="cherry">Cherry</talos-option>
      <talos-option-group label="Citrus">
        <talos-option value="lemon">Lemon</talos-option>
        <talos-option value="orange">Orange</talos-option>
      </talos-option-group>
    </talos-select-input>
  `
})
class TestHostComponent {
  control = new FormControl<string | null>(null, Validators.required);
  label = signal('');
  floating = signal(false);
  placeholder = signal('Choose a fruit');
  searchable = signal(false);
  clearable = signal(false);
}

describe('SelectInputComponent Suite', () => {
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

  it('should initialize with default placeholder and empty value', () => {
    const triggerEl = fixture.nativeElement.querySelector('.select-trigger');
    expect(triggerEl.textContent).toContain('Choose a fruit');
    expect(hostComponent.control.value).toBeNull();
  });

  it('should reflect FormControl initial value via writeValue', () => {
    hostComponent.control.setValue('banana');
    fixture.detectChanges();

    const triggerEl = fixture.nativeElement.querySelector('.select-trigger');
    expect(triggerEl.textContent).toContain('Banana');
  });

  it('should toggle dropdown listbox when clicked', () => {
    const triggerEl = fixture.nativeElement.querySelector('.select-trigger');

    // Open dropdown
    triggerEl.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.select-dropdown-panel')).not.toBeNull();

    // Close dropdown
    triggerEl.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.select-dropdown-panel')).toBeNull();
  });

  it('should update FormControl value when an option is selected', () => {
    const triggerEl = fixture.nativeElement.querySelector('.select-trigger');
    triggerEl.click();
    fixture.detectChanges();

    const options = fixture.nativeElement.querySelectorAll('talos-option');
    options[1].click(); // Select Banana
    fixture.detectChanges();

    expect(hostComponent.control.value).toBe('banana');
    expect(hostComponent.control.touched).toBe(true);
  });

  it('should filter options when search is enabled and typed into', () => {
    hostComponent.searchable.set(true);
    fixture.detectChanges();

    const triggerEl = fixture.nativeElement.querySelector('.select-trigger');
    triggerEl.click();
    fixture.detectChanges();

    const searchInput = fixture.nativeElement.querySelector('.select-search-input');
    expect(searchInput).not.toBeNull();

    searchInput.value = 'lem';
    searchInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const visibleOptions = fixture.nativeElement.querySelectorAll('talos-option:not(.is-hidden)');

    expect(visibleOptions.length).toBe(1);
    expect(visibleOptions[0].textContent).toContain('Lemon');
  });

  it('should support clearable action button', () => {
    hostComponent.clearable.set(true);
    hostComponent.control.setValue('apple');
    fixture.detectChanges();

    const clearBtn = fixture.nativeElement.querySelector('.select-clear-btn');
    expect(clearBtn).not.toBeNull();

    clearBtn.click();
    fixture.detectChanges();

    expect(hostComponent.control.value).toBeNull();
  });

  it('should handle keyboard navigation (ArrowDown, Enter)', () => {
    const hostEl = fixture.nativeElement.querySelector('.talos-select-host');

    // Press ArrowDown to open dropdown
    hostEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.select-dropdown-panel')).not.toBeNull();

    // Press ArrowDown to move to second item (Banana)
    hostEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    fixture.detectChanges();

    // Press Enter to select
    hostEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    fixture.detectChanges();

    expect(hostComponent.control.value).toBe('banana');
  });

  it('should handle disabled state from FormControl', () => {
    hostComponent.control.disable();
    fixture.detectChanges();

    const hostEl = fixture.nativeElement.querySelector('.talos-select-host');
    expect(hostEl.classList.contains('is-disabled')).toBe(true);

    const triggerEl = fixture.nativeElement.querySelector('.select-trigger');
    triggerEl.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.select-dropdown-panel')).toBeNull();
  });

  it('should apply size classes to host element', () => {
    const hostEl = fixture.nativeElement.querySelector('.talos-select-host');
    expect(hostEl.classList.contains('select-sm')).toBe(true);
  });

  it('should render static label when label input is provided', () => {
    hostComponent.label.set('Fruit Choice');
    fixture.detectChanges();

    const labelEl = fixture.nativeElement.querySelector('.talos-field-label');
    expect(labelEl).toBeTruthy();
    expect(labelEl.textContent).toContain('Fruit Choice');
    expect(fixture.nativeElement.querySelector('.talos-floating-label')).toBeFalsy();
  });

  it('should render floating label when floating is toggled true', () => {
    hostComponent.label.set('Fruit Choice');
    hostComponent.floating.set(true);
    fixture.detectChanges();

    const floatingLabelEl = fixture.nativeElement.querySelector('.talos-floating-label');
    expect(floatingLabelEl).toBeTruthy();
    expect(floatingLabelEl.textContent).toContain('Fruit Choice');
    expect(fixture.nativeElement.querySelector('.talos-field-label')).toBeFalsy();
  });
});
