import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { describe, beforeEach, it, expect } from 'vitest';
import { TalosSlideToggleDirective, SlideToggleSize, SlideToggleVariant } from './slide-toggle.directive';
import { TalosSlideToggleComponent, SlideToggleLabelPosition } from './slide-toggle.component';

@Component({
  imports: [TalosSlideToggleDirective, TalosSlideToggleComponent, ReactiveFormsModule],
  template: `
    <!-- Standalone Directive Test -->
    <input
      id="test-directive-toggle"
      type="checkbox"
      talosSlideToggle
      [size]="toggleSize()"
      [variant]="toggleVariant()"
      [disabled]="isDisabled()"
    />

    <!-- Component CVA Test -->
    <talos-slide-toggle
      id="test-component-toggle"
      [formControl]="toggleControl"
      [size]="toggleSize()"
      [variant]="toggleVariant()"
      [disabled]="isDisabled()"
      [labelPosition]="labelPos()"
    >
      Enable Notifications
    </talos-slide-toggle>
  `
})
class TestHostComponent {
  toggleControl = new FormControl<boolean>(false);
  toggleSize = signal<SlideToggleSize>('md');
  toggleVariant = signal<SlideToggleVariant>('primary');
  isDisabled = signal<boolean>(false);
  labelPos = signal<SlideToggleLabelPosition>('after');
}

describe('TalosSlideToggle Suite', () => {
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

  describe('TalosSlideToggleDirective', () => {
    it('should apply talos-slide-toggle class and role="switch"', () => {
      const directiveEl = fixture.nativeElement.querySelector('#test-directive-toggle') as HTMLInputElement;
      expect(directiveEl.classList.contains('talos-slide-toggle')).toBe(true);
      expect(directiveEl.getAttribute('role')).toBe('switch');
    });

    it('should dynamically set size and variant classes', () => {
      const directiveEl = fixture.nativeElement.querySelector('#test-directive-toggle') as HTMLInputElement;

      expect(directiveEl.classList.contains('slide-toggle-md')).toBe(true);
      expect(directiveEl.classList.contains('talos-slide-toggle-primary')).toBe(true);

      hostComponent.toggleSize.set('lg');
      hostComponent.toggleVariant.set('success');
      fixture.detectChanges();

      expect(directiveEl.classList.contains('slide-toggle-lg')).toBe(true);
      expect(directiveEl.classList.contains('talos-slide-toggle-success')).toBe(true);
    });
  });

  describe('TalosSlideToggleComponent', () => {
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
      const wrapperEl = toggleCompEl.querySelector('.talos-slide-toggle-wrapper');

      expect(inputEl.disabled).toBe(true);
      expect(wrapperEl.classList.contains('is-disabled')).toBe(true);
    });

    it('should reflect labelPosition property', () => {
      const toggleCompEl = fixture.nativeElement.querySelector('#test-component-toggle');
      let wrapperEl = toggleCompEl.querySelector('.talos-slide-toggle-wrapper');

      expect(wrapperEl.classList.contains('label-before')).toBe(false);

      hostComponent.labelPos.set('before');
      fixture.detectChanges();

      wrapperEl = toggleCompEl.querySelector('.talos-slide-toggle-wrapper');
      expect(wrapperEl.classList.contains('label-before')).toBe(true);
    });

    it('should render projected content in label', () => {
      const toggleCompEl = fixture.nativeElement.querySelector('#test-component-toggle');
      const labelEl = toggleCompEl.querySelector('.talos-slide-toggle-label');
      expect(labelEl.textContent.trim()).toBe('Enable Notifications');
    });
  });

  describe('TalosSlideToggleComponent with label input fallback', () => {
    @Component({
      imports: [TalosSlideToggleComponent],
      template: `
        <talos-slide-toggle id="fallback-toggle" [label]="'Fallback Label Text'" />
      `
    })
    class FallbackHostComponent {}

    it('should render label text when provided as input property', async () => {
      const fallbackFixture = TestBed.createComponent(FallbackHostComponent);
      fallbackFixture.detectChanges();

      const toggleCompEl = fallbackFixture.nativeElement.querySelector('#fallback-toggle');
      const labelEl = toggleCompEl.querySelector('.talos-slide-toggle-label');
      expect(labelEl.textContent.trim()).toBe('Fallback Label Text');
    });
  });
});
