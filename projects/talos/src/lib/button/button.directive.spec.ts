import { describe, it, expect, beforeEach } from 'vitest';
import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TalosButtonDirective, ButtonVariant, ButtonSize } from './button.directive';

@Component({
  imports: [TalosButtonDirective],
  template: `
    <button
      talosButton
      [variant]="variant()"
      [size]="size()"
      [iconOnly]="iconOnly()"
      [fullWidth]="fullWidth()"
      [pill]="pill()"
      [loading]="loading()"
      [disabled]="disabled()"
    >
      Click Me
    </button>
  `
})
class TestHostComponent {
  readonly variant = signal<ButtonVariant>('primary');
  readonly size = signal<ButtonSize>('md');
  readonly iconOnly = signal<boolean>(false);
  readonly fullWidth = signal<boolean>(false);
  readonly pill = signal<boolean>(false);
  readonly loading = signal<boolean>(false);
  readonly disabled = signal<boolean>(false);
}

describe('TalosButtonDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;
  let buttonEl: HTMLButtonElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TalosButtonDirective, TestHostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    fixture.detectChanges();
    buttonEl = fixture.nativeElement.querySelector('button');
  });

  it('should apply base class and default primary variant & md size', () => {
    expect(buttonEl.classList.contains('talos-btn')).toBe(true);
    expect(buttonEl.classList.contains('talos-btn-primary')).toBe(true);
    expect(buttonEl.classList.contains('talos-btn-md')).toBe(true);
  });

  it('should dynamically update variant classes', () => {
    hostComponent.variant.set('danger');
    fixture.detectChanges();
    expect(buttonEl.classList.contains('talos-btn-danger')).toBe(true);
    expect(buttonEl.classList.contains('talos-btn-primary')).toBe(false);

    hostComponent.variant.set('outline');
    fixture.detectChanges();
    expect(buttonEl.classList.contains('talos-btn-outline')).toBe(true);

    hostComponent.variant.set('secondary');
    fixture.detectChanges();
    expect(buttonEl.classList.contains('talos-btn-secondary')).toBe(true);

    hostComponent.variant.set('ghost');
    fixture.detectChanges();
    expect(buttonEl.classList.contains('talos-btn-ghost')).toBe(true);

    hostComponent.variant.set('subtle');
    fixture.detectChanges();
    expect(buttonEl.classList.contains('talos-btn-subtle')).toBe(true);

    hostComponent.variant.set('success');
    fixture.detectChanges();
    expect(buttonEl.classList.contains('talos-btn-success')).toBe(true);

    hostComponent.variant.set('link');
    fixture.detectChanges();
    expect(buttonEl.classList.contains('talos-btn-link')).toBe(true);
  });

  it('should dynamically update size classes', () => {
    hostComponent.size.set('sm');
    fixture.detectChanges();
    expect(buttonEl.classList.contains('talos-btn-sm')).toBe(true);

    hostComponent.size.set('lg');
    fixture.detectChanges();
    expect(buttonEl.classList.contains('talos-btn-lg')).toBe(true);
  });

  it('should toggle modifier classes (iconOnly, fullWidth, pill)', () => {
    hostComponent.iconOnly.set(true);
    hostComponent.fullWidth.set(true);
    hostComponent.pill.set(true);
    fixture.detectChanges();

    expect(buttonEl.classList.contains('talos-btn-icon')).toBe(true);
    expect(buttonEl.classList.contains('talos-btn-full')).toBe(true);
    expect(buttonEl.classList.contains('talos-btn-pill')).toBe(true);
  });

  it('should handle loading state', () => {
    hostComponent.loading.set(true);
    fixture.detectChanges();

    expect(buttonEl.classList.contains('is-loading')).toBe(true);
    expect(buttonEl.hasAttribute('disabled')).toBe(true);
    expect(buttonEl.getAttribute('aria-disabled')).toBe('true');
  });

  it('should handle disabled state', () => {
    hostComponent.disabled.set(true);
    fixture.detectChanges();

    expect(buttonEl.hasAttribute('disabled')).toBe(true);
    expect(buttonEl.getAttribute('aria-disabled')).toBe('true');
  });

  it('should calculate ripple position variables on pointerdown', () => {
    buttonEl.getBoundingClientRect = () => ({
      left: 100,
      top: 100,
      width: 120,
      height: 40,
      right: 220,
      bottom: 140,
      x: 100,
      y: 100,
      toJSON: () => { }
    });

    const pointerEvent = new PointerEvent('pointerdown', {
      clientX: 130,
      clientY: 110,
      bubbles: true
    });

    buttonEl.dispatchEvent(pointerEvent);
    fixture.detectChanges();

    expect(buttonEl.style.getPropertyValue('--ripple-x')).toBe('30px');
    expect(buttonEl.style.getPropertyValue('--ripple-y')).toBe('10px');
  });
});
