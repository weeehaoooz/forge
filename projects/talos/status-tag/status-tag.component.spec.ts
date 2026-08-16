import { describe, it, expect, beforeEach } from 'vitest';
import { Component, Type, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LucideActivity, LucideBug } from '@lucide/angular';
import { TalosStatusTagComponent } from './status-tag.component';
import {
  TalosStatusTagShape,
  TalosStatusTagSize,
  TalosStatusTagVariant,
  TalosWorkflowStatus
} from './status-tag.types';

@Component({
  imports: [TalosStatusTagComponent],
  template: `
    <talos-status-tag
      [status]="status()"
      [label]="label()"
      [variant]="variant()"
      [size]="size()"
      [shape]="shape()"
      [showIcon]="showIcon()"
      [icon]="icon()"
      [iconOnly]="iconOnly()"
      [pulse]="pulse()"
      [ariaLabel]="ariaLabel()"
    />
  `
})
class TestStatusTagHostComponent {
  readonly status = signal<TalosWorkflowStatus | string>('NEW');
  readonly label = signal<string | undefined>(undefined);
  readonly variant = signal<TalosStatusTagVariant>('subtle');
  readonly size = signal<TalosStatusTagSize>('md');
  readonly shape = signal<TalosStatusTagShape>('rounded');
  readonly showIcon = signal<boolean>(true);
  readonly icon = signal<Type<unknown> | null>(null);
  readonly iconOnly = signal<boolean>(false);
  readonly pulse = signal<boolean>(false);
  readonly ariaLabel = signal<string | undefined>(undefined);
}

@Component({
  imports: [TalosStatusTagComponent],
  template: `
    <talos-status-tag [status]="'IN-PROGRESS'">
      Running Step 4 of 10
    </talos-status-tag>
  `
})
class TestProjectedHostComponent {}

describe('TalosStatusTagComponent Suite', () => {
  let fixture: ComponentFixture<TestStatusTagHostComponent>;
  let host: TestStatusTagHostComponent;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TalosStatusTagComponent, TestStatusTagHostComponent, TestProjectedHostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestStatusTagHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
    element = fixture.nativeElement.querySelector('talos-status-tag');
  });

  it('should create and apply base host classes for default NEW status', () => {
    expect(element).toBeTruthy();
    expect(element.classList.contains('talos-status-tag')).toBe(true);
    expect(element.classList.contains('talos-status-tag--new')).toBe(true);
    expect(element.classList.contains('talos-status-tag--subtle')).toBe(true);
    expect(element.classList.contains('talos-status-tag--md')).toBe(true);
    expect(element.classList.contains('talos-status-tag--rounded')).toBe(true);
    expect(element.getAttribute('role')).toBe('status');
    expect(element.getAttribute('aria-label')).toBe('Status: New: New');
    expect(element.textContent?.trim()).toContain('New');
  });

  it('should correctly normalize and style all 11 canonical workflow statuses', () => {
    const statusTests: { input: TalosWorkflowStatus | string; expectedClass: string; expectedLabel: string }[] = [
      { input: 'NEW', expectedClass: 'talos-status-tag--new', expectedLabel: 'New' },
      { input: 'PENDING', expectedClass: 'talos-status-tag--pending', expectedLabel: 'Pending' },
      { input: 'IN-PROGRESS', expectedClass: 'talos-status-tag--inprogress', expectedLabel: 'In Progress' },
      { input: 'PAUSED', expectedClass: 'talos-status-tag--paused', expectedLabel: 'Paused' },
      { input: 'RETRYING', expectedClass: 'talos-status-tag--retrying', expectedLabel: 'Retrying' },
      { input: 'SKIPPED', expectedClass: 'talos-status-tag--skipped', expectedLabel: 'Skipped' },
      { input: 'SUCCESS', expectedClass: 'talos-status-tag--success', expectedLabel: 'Success' },
      { input: 'COMPLETED', expectedClass: 'talos-status-tag--completed', expectedLabel: 'Completed' },
      { input: 'ERROR', expectedClass: 'talos-status-tag--error', expectedLabel: 'Error' },
      { input: 'TERMINATED', expectedClass: 'talos-status-tag--terminated', expectedLabel: 'Terminated' },
      { input: 'EXPIRED', expectedClass: 'talos-status-tag--expired', expectedLabel: 'Expired' }
    ];

    for (const test of statusTests) {
      host.status.set(test.input);
      fixture.detectChanges();

      expect(element.classList.contains(test.expectedClass)).toBe(true);
      expect(element.textContent?.trim()).toContain(test.expectedLabel);
    }
  });

  it('should normalize industry aliases correctly', () => {
    const aliasTests: { alias: string; expectedClass: string }[] = [
      { alias: 'running', expectedClass: 'talos-status-tag--inprogress' },
      { alias: 'in_progress', expectedClass: 'talos-status-tag--inprogress' },
      { alias: 'queued', expectedClass: 'talos-status-tag--pending' },
      { alias: 'scheduled', expectedClass: 'talos-status-tag--pending' },
      { alias: 'failed', expectedClass: 'talos-status-tag--error' },
      { alias: 'failure', expectedClass: 'talos-status-tag--error' },
      { alias: 'cancelled', expectedClass: 'talos-status-tag--terminated' },
      { alias: 'aborted', expectedClass: 'talos-status-tag--terminated' },
      { alias: 'timeout', expectedClass: 'talos-status-tag--expired' },
      { alias: 'timed_out', expectedClass: 'talos-status-tag--expired' },
      { alias: 'suspended', expectedClass: 'talos-status-tag--paused' },
      { alias: 'on_hold', expectedClass: 'talos-status-tag--paused' },
      { alias: 'up_for_retry', expectedClass: 'talos-status-tag--retrying' },
      { alias: 'bypassed', expectedClass: 'talos-status-tag--skipped' },
      { alias: 'done', expectedClass: 'talos-status-tag--completed' },
      { alias: 'succeeded', expectedClass: 'talos-status-tag--success' }
    ];

    for (const test of aliasTests) {
      host.status.set(test.alias);
      fixture.detectChanges();

      expect(element.classList.contains(test.expectedClass)).toBe(true);
    }
  });

  it('should render custom label when provided via label input', () => {
    host.status.set('IN-PROGRESS');
    host.label.set('Provisioning DB Cluster');
    fixture.detectChanges();

    expect(element.textContent?.trim()).toBe('Provisioning DB Cluster');
    expect(element.getAttribute('aria-label')).toBe('Status: In Progress: Provisioning DB Cluster');
  });

  it('should support projected text via ng-content', () => {
    const projectedFixture = TestBed.createComponent(TestProjectedHostComponent);
    projectedFixture.detectChanges();
    const projectedEl = projectedFixture.nativeElement.querySelector('talos-status-tag');

    expect(projectedEl.textContent?.trim()).toBe('Running Step 4 of 10');
  });

  it('should dynamically switch variants (subtle, solid, outline, dot)', () => {
    host.variant.set('solid');
    fixture.detectChanges();
    expect(element.classList.contains('talos-status-tag--solid')).toBe(true);

    host.variant.set('outline');
    fixture.detectChanges();
    expect(element.classList.contains('talos-status-tag--outline')).toBe(true);

    host.variant.set('dot');
    fixture.detectChanges();
    expect(element.classList.contains('talos-status-tag--dot')).toBe(true);
    expect(element.querySelector('.talos-status-tag__dot')).toBeTruthy();
  });

  it('should dynamically update sizes (xs, sm, md, lg)', () => {
    host.size.set('xs');
    fixture.detectChanges();
    expect(element.classList.contains('talos-status-tag--xs')).toBe(true);

    host.size.set('sm');
    fixture.detectChanges();
    expect(element.classList.contains('talos-status-tag--sm')).toBe(true);

    host.size.set('lg');
    fixture.detectChanges();
    expect(element.classList.contains('talos-status-tag--lg')).toBe(true);
  });

  it('should dynamically update shapes (rounded, pill, square)', () => {
    host.shape.set('pill');
    fixture.detectChanges();
    expect(element.classList.contains('talos-status-tag--pill')).toBe(true);

    host.shape.set('square');
    fixture.detectChanges();
    expect(element.classList.contains('talos-status-tag--square')).toBe(true);
  });

  it('should hide icon when showIcon is false', () => {
    host.showIcon.set(false);
    fixture.detectChanges();

    expect(element.querySelector('.talos-status-tag__icon')).toBeNull();
  });

  it('should support iconOnly mode and visually hide text', () => {
    host.iconOnly.set(true);
    fixture.detectChanges();

    expect(element.classList.contains('talos-status-tag--icon-only')).toBe(true);
    expect(element.querySelector('.talos-sr-only')).toBeTruthy();
  });

  it('should support custom icon override component', () => {
    host.icon.set(LucideBug);
    fixture.detectChanges();

    expect(element.querySelector('.talos-status-tag__icon')).toBeTruthy();
  });

  it('should apply pulse animation and ping beacon when pulse is true', () => {
    host.pulse.set(true);
    fixture.detectChanges();
    expect(element.classList.contains('talos-status-tag--pulse')).toBe(true);

    host.variant.set('dot');
    fixture.detectChanges();
    expect(element.querySelector('.talos-status-tag__dot-ping')).toBeTruthy();
  });

  it('should support custom ariaLabel override', () => {
    host.ariaLabel.set('Custom accessible description');
    fixture.detectChanges();

    expect(element.getAttribute('aria-label')).toBe('Custom accessible description');
  });

  it('should fallback gracefully to PENDING for unknown status string', () => {
    host.status.set('UNKNOWN_STATUS_XYZ');
    fixture.detectChanges();

    expect(element.classList.contains('talos-status-tag--pending')).toBe(true);
    expect(element.textContent?.trim()).toContain('Pending');
  });
});
