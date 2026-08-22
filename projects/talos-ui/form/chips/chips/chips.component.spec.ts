import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Component, signal } from '@angular/core';
import { describe, beforeEach, it, expect } from 'vitest';
import { TalosChipsComponent } from './chips.component';
import { TalosChipComponent } from '../chip/chip.component';

@Component({
  imports: [TalosChipsComponent, ReactiveFormsModule],
  template: `
    <talos-chips
      [formControl]="control"
      [options]="options()"
      [placeholder]="placeholder()"
      [allowCustom]="allowCustom()"
      [maxChips]="maxChips()"
      [label]="label()"
      [floating]="floating()"
      (search)="onSearch($event)"
      (searchChange)="onSearchChange($event)"
    />
  `
})
class TestHostComponent {
  readonly control = new FormControl<string[]>([]);
  readonly options = signal<string[]>(['Angular', 'React', 'Vue', 'Svelte', 'Solid']);
  readonly placeholder = signal<string>('Select framework...');
  readonly allowCustom = signal<boolean>(false);
  readonly maxChips = signal<number | null>(null);
  readonly label = signal<string>('');
  readonly floating = signal<boolean>(false);
  readonly lastSearch = signal<string>('');
  readonly lastSearchChange = signal<string>('');

  onSearch(val: string): void {
    this.lastSearch.set(val);
  }

  onSearchChange(val: string): void {
    this.lastSearchChange.set(val);
  }
}

describe('TalosChipsComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let chipsEl: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, TalosChipsComponent, TalosChipComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
    chipsEl = fixture.nativeElement.querySelector('talos-chips');
  });

  it('should create the chips component', () => {
    expect(chipsEl).toBeTruthy();
  });

  it('should open dropdown on container click and show options', () => {
    const controlBox = chipsEl.querySelector('.chips-control') as HTMLElement;
    controlBox.click();
    fixture.detectChanges();

    const dropdown = chipsEl.querySelector('.chips-dropdown');
    expect(dropdown).toBeTruthy();

    const optionItems = chipsEl.querySelectorAll('.chips-option-item');
    expect(optionItems.length).toBe(5);
  });

  it('should select an option when clicked', () => {
    const controlBox = chipsEl.querySelector('.chips-control') as HTMLElement;
    controlBox.click();
    fixture.detectChanges();

    const firstOption = chipsEl.querySelector('.chips-option-item') as HTMLElement;
    firstOption.click();
    fixture.detectChanges();

    expect(host.control.value).toEqual(['Angular']);

    const chipElements = chipsEl.querySelectorAll('talos-chip');
    expect(chipElements.length).toBe(1);
    expect(chipElements[0].textContent).toContain('Angular');
  });

  it('should remove a selected chip when remove button is clicked', () => {
    host.control.setValue(['Angular', 'React']);
    fixture.detectChanges();

    let chipElements = chipsEl.querySelectorAll('talos-chip');
    expect(chipElements.length).toBe(2);

    const firstRemoveBtn = chipElements[0].querySelector('.talos-chip-remove-btn') as HTMLButtonElement;
    firstRemoveBtn.click();
    fixture.detectChanges();

    expect(host.control.value).toEqual(['React']);
    chipElements = chipsEl.querySelectorAll('talos-chip');
    expect(chipElements.length).toBe(1);
  });

  it('should filter options based on search input', () => {
    const input = chipsEl.querySelector('.chips-input') as HTMLInputElement;
    input.focus();
    input.value = 'vue';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const optionItems = chipsEl.querySelectorAll('.chips-option-item');
    expect(optionItems.length).toBe(1);
    expect(optionItems[0].textContent).toContain('Vue');
  });

  it('should remove last chip on Backspace if input is empty', () => {
    host.control.setValue(['Angular', 'React']);
    fixture.detectChanges();

    const input = chipsEl.querySelector('.chips-input') as HTMLInputElement;
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' }));
    fixture.detectChanges();

    expect(host.control.value).toEqual(['Angular']);
  });

  it('should add custom chips when allowCustom is true', () => {
    host.allowCustom.set(true);
    fixture.detectChanges();

    const input = chipsEl.querySelector('.chips-input') as HTMLInputElement;
    input.value = 'Qwik';
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    fixture.detectChanges();

    expect(host.control.value).toEqual(['Qwik']);
  });

  it('should clear all chips when clearAll button is clicked', () => {
    host.control.setValue(['Angular', 'React', 'Vue']);
    fixture.detectChanges();

    const clearBtn = chipsEl.querySelector('.chips-clear-btn') as HTMLButtonElement;
    expect(clearBtn).toBeTruthy();

    clearBtn.click();
    fixture.detectChanges();

    expect(host.control.value).toEqual([]);
  });

  it('should respect maxChips limit', () => {
    host.maxChips.set(2);
    host.control.setValue(['Angular', 'React']);
    fixture.detectChanges();

    // Input should be removed or disabled when max is reached
    const input = chipsEl.querySelector('.chips-input') as HTMLInputElement;
    expect(input).toBeNull();
  });

  it('should render standard label when floating is false', () => {
    host.label.set('Skills');
    host.floating.set(false);
    fixture.detectChanges();

    const standardLabel = chipsEl.querySelector('.talos-field-label');
    expect(standardLabel).toBeTruthy();
    expect(standardLabel?.textContent).toContain('Skills');

    const floatingLabel = chipsEl.querySelector('.talos-floating-label');
    expect(floatingLabel).toBeNull();
  });

  it('should render floating label and float when focused or has value', () => {
    host.label.set('Skills');
    host.floating.set(true);
    fixture.detectChanges();

    let floatingLabel = chipsEl.querySelector('.talos-floating-label');
    expect(floatingLabel).toBeTruthy();
    expect(floatingLabel?.textContent).toContain('Skills');
    expect(floatingLabel?.classList.contains('is-floated')).toBe(false);

    // Add a value -> label should float
    host.control.setValue(['Angular']);
    fixture.detectChanges();

    floatingLabel = chipsEl.querySelector('.talos-floating-label');
    expect(floatingLabel?.classList.contains('is-floated')).toBe(true);
  });

  it('should emit search and searchChange outputs when user types', () => {
    const input = chipsEl.querySelector('.chips-input') as HTMLInputElement;
    input.focus();
    input.value = 'Re';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(host.lastSearch()).toBe('Re');
    expect(host.lastSearchChange()).toBe('Re');
  });
});
