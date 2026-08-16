import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { describe, beforeEach, it, expect } from 'vitest';
import { TalosRangeInputComponent } from './range-input.component';
import { TalosRangeInputModule } from './range-input.module';
import { RangeInputValue } from './range-input.types';

@Component({
  imports: [TalosRangeInputModule, ReactiveFormsModule],
  template: `
    <talos-range-input
      [formControl]="control"
      [min]="min()"
      [max]="max()"
      [step]="step()"
      [interval]="interval()"
      [range]="range()"
      [showTicks]="showTicks()"
      [showIntervals]="showIntervals()"
      (valueChange)="onValueChange($event)"
    />
  `
})
class TestHostComponent {
  control = new FormControl<RangeInputValue>(30);
  min = signal(0);
  max = signal(100);
  step = signal(5);
  interval = signal(25);
  range = signal(false);
  showTicks = signal(true);
  showIntervals = signal(true);

  lastValue = signal<RangeInputValue | null>(null);

  onValueChange(val: RangeInputValue): void {
    this.lastValue.set(val);
  }
}

describe('TalosRangeInputComponent Suite', () => {
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

  it('should initialize single slider with default value from FormControl', () => {
    const thumb = fixture.nativeElement.querySelector('.talos-range-thumb') as HTMLElement;
    expect(thumb).toBeTruthy();
    expect(thumb.getAttribute('aria-valuenow')).toBe('30');
    expect(thumb.getAttribute('aria-valuemin')).toBe('0');
    expect(thumb.getAttribute('aria-valuemax')).toBe('100');
  });

  it('should update value via keyboard navigation', () => {
    const thumb = fixture.nativeElement.querySelector('.talos-range-thumb') as HTMLElement;
    expect(thumb).toBeTruthy();

    // Press ArrowRight to increase by step (5)
    thumb.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    fixture.detectChanges();

    expect(hostComponent.control.value).toBe(35);
    expect(thumb.getAttribute('aria-valuenow')).toBe('35');

    // Press ArrowLeft to decrease by step (5)
    thumb.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    fixture.detectChanges();

    expect(hostComponent.control.value).toBe(30);
  });

  it('should jump to min/max on Home/End keys', () => {
    const thumb = fixture.nativeElement.querySelector('.talos-range-thumb') as HTMLElement;

    thumb.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
    fixture.detectChanges();
    expect(hostComponent.control.value).toBe(0);

    thumb.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    fixture.detectChanges();
    expect(hostComponent.control.value).toBe(100);
  });

  it('should render interval ticks and labels when configured', () => {
    // interval is 25, min 0, max 100 -> 0, 25, 50, 75, 100 (5 ticks)
    const ticks = fixture.nativeElement.querySelectorAll('.talos-range-tick');
    expect(ticks.length).toBe(5);

    const labels = fixture.nativeElement.querySelectorAll('.talos-range-label-item');
    expect(labels.length).toBe(5);
    expect(labels[0].textContent.trim()).toBe('0');
    expect(labels[4].textContent.trim()).toBe('100');
  });

  it('should support dual-handle range mode', () => {
    hostComponent.range.set(true);
    hostComponent.control.setValue([20, 80]);
    fixture.detectChanges();

    const thumbs = fixture.nativeElement.querySelectorAll('.talos-range-thumb');
    expect(thumbs.length).toBe(2);

    expect(thumbs[0].getAttribute('aria-valuenow')).toBe('20');
    expect(thumbs[1].getAttribute('aria-valuenow')).toBe('80');

    // ArrowRight on thumb0
    thumbs[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    fixture.detectChanges();

    const val = hostComponent.control.value as [number, number];
    expect(val[0]).toBe(25);
    expect(val[1]).toBe(80);
  });

  it('should respect disabled state from FormControl', () => {
    hostComponent.control.disable();
    fixture.detectChanges();

    const wrapper = fixture.nativeElement.querySelector('.talos-range-wrapper');
    expect(wrapper.classList.contains('is-disabled')).toBe(true);

    const thumb = fixture.nativeElement.querySelector('.talos-range-thumb') as HTMLElement;
    expect(thumb.getAttribute('aria-disabled')).toBe('true');

    // Keydown should have no effect when disabled
    thumb.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    fixture.detectChanges();
    expect(hostComponent.control.value).toBe(30);
  });
});
