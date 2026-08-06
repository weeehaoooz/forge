import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { describe, beforeEach, it, expect } from 'vitest';
import { SelectInputComponent } from './select-input.component';
import { OptionComponent } from './option/option.component';
import { OptionGroupComponent } from './option-group/option-group.component';

@Component({
  imports: [SelectInputComponent, OptionComponent, OptionGroupComponent, ReactiveFormsModule],
  template: `
    <app-select-input
      [formControl]="control"
      [placeholder]="placeholder()"
      [searchable]="searchable()"
      [clearable]="clearable()"
    >
      <app-option value="apple">Apple</app-option>
      <app-option value="banana">Banana</app-option>
      <app-option value="cherry">Cherry</app-option>
      <app-option-group label="Citrus">
        <app-option value="lemon">Lemon</app-option>
        <app-option value="orange">Orange</app-option>
      </app-option-group>
    </app-select-input>
  `
})
class TestHostComponent {
  control = new FormControl<string | null>(null, Validators.required);
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

    const options = fixture.nativeElement.querySelectorAll('app-option');
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

    const visibleOptions = fixture.nativeElement.querySelectorAll('app-option:not(.is-hidden)');

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
    const hostEl = fixture.nativeElement.querySelector('.app-select-host');

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

    const hostEl = fixture.nativeElement.querySelector('.app-select-host');
    expect(hostEl.classList.contains('is-disabled')).toBe(true);

    const triggerEl = fixture.nativeElement.querySelector('.select-trigger');
    triggerEl.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.select-dropdown-panel')).toBeNull();
  });

  it('should apply size classes to host element', () => {
    const hostEl = fixture.nativeElement.querySelector('.app-select-host');
    expect(hostEl.classList.contains('select-sm')).toBe(true);
  });
});
