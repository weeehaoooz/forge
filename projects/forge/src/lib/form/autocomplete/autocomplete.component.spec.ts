import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { describe, beforeEach, it, expect } from 'vitest';
import { ForgeAutocompleteComponent } from './autocomplete.component';
import { ForgeAutocompleteModule } from './autocomplete.module';

interface Country {
  code: string;
  name: string;
  region: string;
}

@Component({
  imports: [ForgeAutocompleteModule, ReactiveFormsModule],
  template: `
    <forge-autocomplete
      [formControl]="control"
      [options]="countries()"
      [searching]="searching()"
      [placeholder]="placeholder()"
      [clearable]="clearable()"
      [minChars]="minChars()"
      displayWith="name"
      valueWith="code"
      (searchChange)="onSearchChange($event)"
      (selectionChange)="onSelectionChange($event)"
    />
  `
})
class TestHostComponent {
  control = new FormControl<string | null>(null, Validators.required);
  countries = signal<Country[]>([
    { code: 'US', name: 'United States', region: 'Americas' },
    { code: 'CA', name: 'Canada', region: 'Americas' },
    { code: 'UK', name: 'United Kingdom', region: 'Europe' },
    { code: 'DE', name: 'Germany', region: 'Europe' },
    { code: 'JP', name: 'Japan', region: 'Asia' },
    { code: 'AU', name: 'Australia', region: 'Oceania' }
  ]);
  searching = signal(false);
  placeholder = signal('Search country...');
  clearable = signal(true);
  minChars = signal(0);

  lastSearch = signal<string>('');
  lastSelection = signal<Country | null>(null);

  onSearchChange(val: string): void {
    this.lastSearch.set(val);
  }

  onSelectionChange(val: Country | null): void {
    this.lastSelection.set(val);
  }
}

describe('ForgeAutocompleteComponent Suite', () => {
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

  it('should initialize with default placeholder and empty input', () => {
    const inputEl = fixture.nativeElement.querySelector('input.autocomplete-input') as HTMLInputElement;
    expect(inputEl).toBeTruthy();
    expect(inputEl.placeholder).toBe('Search country...');
    expect(inputEl.value).toBe('');
    expect(hostComponent.control.value).toBeNull();
  });

  it('should reflect FormControl initial value via writeValue', () => {
    hostComponent.control.setValue('CA');
    fixture.detectChanges();

    const inputEl = fixture.nativeElement.querySelector('input.autocomplete-input') as HTMLInputElement;
    expect(inputEl.value).toBe('Canada');
  });

  it('should filter options based on user input', () => {
    const inputEl = fixture.nativeElement.querySelector('input.autocomplete-input') as HTMLInputElement;
    inputEl.value = 'uni';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(hostComponent.lastSearch()).toBe('uni');

    const options = fixture.nativeElement.querySelectorAll('.autocomplete-option');
    expect(options.length).toBe(2); // United States, United Kingdom
    expect(options[0].textContent).toContain('United States');
    expect(options[1].textContent).toContain('United Kingdom');
  });

  it('should select an option on click and update FormControl value', () => {
    const inputEl = fixture.nativeElement.querySelector('input.autocomplete-input') as HTMLInputElement;
    inputEl.value = 'can';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const options = fixture.nativeElement.querySelectorAll('.autocomplete-option');
    expect(options.length).toBe(1);

    options[0].dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    fixture.detectChanges();

    expect(hostComponent.control.value).toBe('CA');
    expect(hostComponent.lastSelection()?.name).toBe('Canada');
    expect(inputEl.value).toBe('Canada');
  });

  it('should display searching spinner when searching input signal is true', () => {
    // Spinner shouldn't be visible by default
    expect(fixture.nativeElement.querySelector('.autocomplete-spinner')).toBeNull();

    // Set searching to true
    hostComponent.searching.set(true);
    fixture.detectChanges();

    const spinner = fixture.nativeElement.querySelector('.autocomplete-spinner');
    expect(spinner).toBeTruthy();
    expect(spinner.getAttribute('aria-label')).toBe('Searching...');
  });

  it('should navigate options with keyboard (ArrowDown, ArrowUp, Enter)', () => {
    const inputEl = fixture.nativeElement.querySelector('input.autocomplete-input') as HTMLInputElement;
    inputEl.focus();
    inputEl.dispatchEvent(new Event('focus'));
    fixture.detectChanges();

    // Press ArrowDown to focus first option
    inputEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    fixture.detectChanges();

    let options = fixture.nativeElement.querySelectorAll('.autocomplete-option');
    expect(options[0].classList.contains('is-focused')).toBe(true);

    // Press ArrowDown to focus second option
    inputEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    fixture.detectChanges();
    options = fixture.nativeElement.querySelectorAll('.autocomplete-option');
    expect(options[1].classList.contains('is-focused')).toBe(true);

    // Press Enter to select focused option
    inputEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    fixture.detectChanges();

    expect(hostComponent.control.value).toBe('CA');
    expect(inputEl.value).toBe('Canada');
  });

  it('should clear selection when clear button is clicked', () => {
    hostComponent.control.setValue('DE');
    fixture.detectChanges();

    const inputEl = fixture.nativeElement.querySelector('input.autocomplete-input') as HTMLInputElement;
    expect(inputEl.value).toBe('Germany');

    const clearBtn = fixture.nativeElement.querySelector('.autocomplete-clear-btn') as HTMLButtonElement;
    expect(clearBtn).toBeTruthy();

    clearBtn.click();
    fixture.detectChanges();

    expect(hostComponent.control.value).toBeNull();
    expect(inputEl.value).toBe('');
  });

  it('should allow user-configurable search results dynamically (e.g. async update)', () => {
    // Update options dynamically as in an async search
    hostComponent.countries.set([
      { code: 'SG', name: 'Singapore', region: 'Asia' },
      { code: 'MY', name: 'Malaysia', region: 'Asia' }
    ]);
    fixture.detectChanges();

    const inputEl = fixture.nativeElement.querySelector('input.autocomplete-input') as HTMLInputElement;
    inputEl.value = 'sing';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const options = fixture.nativeElement.querySelectorAll('.autocomplete-option');
    expect(options.length).toBe(1);
    expect(options[0].textContent).toContain('Singapore');
  });
});
