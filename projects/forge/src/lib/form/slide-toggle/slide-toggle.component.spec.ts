import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { describe, beforeEach, it, expect } from 'vitest';
import { ForgeSlideToggleDirective, SlideToggleSize, SlideToggleVariant } from './slide-toggle.directive';
import { ForgeSlideToggleComponent, SlideToggleLabelPosition } from './slide-toggle.component';

@Component({
  imports: [ForgeSlideToggleDirective, ForgeSlideToggleComponent, ReactiveFormsModule],
  template: `
    <!-- Standalone Directive Test -->
    <input
      id="test-directive-toggle"
      type="checkbox"
      forgeSlideToggle
      [size]="toggleSize()"
      [variant]="toggleVariant()"
      [disabled]="isDisabled()"
    />

    <!-- Component CVA Test -->
    <forge-slide-toggle
      id="test-component-toggle"
      [formControl]="toggleControl"
      [size]="toggleSize()"
      [variant]="toggleVariant()"
      [disabled]="isDisabled()"
      [labelPosition]="labelPos()"
    >
      Enable Notifications
    </forge-slide-toggle>
  `
})
class TestHostComponent {
  toggleControl = new FormControl<boolean>(false);
  toggleSize = signal<SlideToggleSize>('md');
  toggleVariant = signal<SlideToggleVariant>('primary');
  isDisabled = signal<boolean>(false);
  labelPos = signal<SlideToggleLabelPosition>('after');
}

describe('ForgeSlideToggle Suite', () => {
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

  describe('ForgeSlideToggleDirective', () => {
    it('should apply forge-slide-toggle class and role="switch"', () => {
      const directiveEl = fixture.nativeElement.querySelector('#test-directive-toggle') as HTMLInputElement;
      expect(directiveEl.classList.contains('forge-slide-toggle')).toBe(true);
      expect(directiveEl.getAttribute('role')).toBe('switch');
    });

    it('should dynamically set size and variant classes', () => {
      const directiveEl = fixture.nativeElement.querySelector('#test-directive-toggle') as HTMLInputElement;

      expect(directiveEl.classList.contains('slide-toggle-md')).toBe(true);
      expect(directiveEl.classList.contains('forge-slide-toggle-primary')).toBe(true);

      hostComponent.toggleSize.set('lg');
      hostComponent.toggleVariant.set('success');
      fixture.detectChanges();

      expect(directiveEl.classList.contains('slide-toggle-lg')).toBe(true);
      expect(directiveEl.classList.contains('forge-slide-toggle-success')).toBe(true);
    });
  });

  describe('ForgeSlideToggleComponent', () => {
    it('should bind properly with Reactive Forms (ControlValueAccessor)', () => {
      const toggleCompEl = fixture.nativeElement.querySelector('#test-component-toggle');
      const inputEl = toggleCompEl.querySelector('input[type="checkbox"]') as HTMLInputElement;

      expect(inputEl.checked).toBe(false);
      expect(hostComponent.toggleControl.value).toBe(false);

      // User clicks switch input
      inputEl.click();
      fixture.detectChanges();

      expect(hostComponent.toggleControl.value).toBe(true);

      // Form control updates programmatically
      hostComponent.toggleControl.setValue(false);
      fixture.detectChanges();

      expect(inputEl.checked).toBe(false);
    });

    it('should handle disabled state correctly', () => {
      hostComponent.isDisabled.set(true);
      fixture.detectChanges();

      const toggleCompEl = fixture.nativeElement.querySelector('#test-component-toggle');
      const inputEl = toggleCompEl.querySelector('input[type="checkbox"]') as HTMLInputElement;
      const wrapperEl = toggleCompEl.querySelector('.forge-slide-toggle-wrapper');

      expect(inputEl.disabled).toBe(true);
      expect(wrapperEl.classList.contains('is-disabled')).toBe(true);
    });

    it('should reflect labelPosition property', () => {
      const toggleCompEl = fixture.nativeElement.querySelector('#test-component-toggle');
      let wrapperEl = toggleCompEl.querySelector('.forge-slide-toggle-wrapper');

      expect(wrapperEl.classList.contains('label-before')).toBe(false);

      hostComponent.labelPos.set('before');
      fixture.detectChanges();

      wrapperEl = toggleCompEl.querySelector('.forge-slide-toggle-wrapper');
      expect(wrapperEl.classList.contains('label-before')).toBe(true);
    });
  });
});
