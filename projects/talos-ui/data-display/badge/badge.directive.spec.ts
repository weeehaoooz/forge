import { describe, it, expect, beforeEach } from 'vitest';
import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TalosBadgeDirective } from './badge.directive';
import {
  TalosBadgePosition,
  TalosBadgeShape,
  TalosBadgeSize,
  TalosBadgeVariant,
  formatBadgeContent
} from './badge.types';

@Component({
  imports: [TalosBadgeDirective],
  template: `
    <button
      id="test-btn"
      [talosBadge]="content()"
      [talosBadgeMax]="max()"
      [talosBadgeSize]="size()"
      [talosBadgePosition]="position()"
      [talosBadgeVariant]="variant()"
      [talosBadgeShape]="shape()"
      [talosBadgeDot]="dot()"
      [talosBadgePulse]="pulse()"
      [talosBadgeHidden]="hidden()"
      [talosBadgeOverlap]="overlap()"
      [talosBadgeAriaLabel]="ariaLabel()"
    >
      Notifications
    </button>
  `
})
class TestBadgeHostComponent {
  readonly content = signal<string | number | null | undefined>(5);
  readonly max = signal<number | null | undefined>(undefined);
  readonly size = signal<TalosBadgeSize>('md');
  readonly position = signal<TalosBadgePosition>('top-right');
  readonly variant = signal<TalosBadgeVariant>('primary');
  readonly shape = signal<TalosBadgeShape>('circle');
  readonly dot = signal<boolean>(false);
  readonly pulse = signal<boolean>(false);
  readonly hidden = signal<boolean>(false);
  readonly overlap = signal<boolean>(true);
  readonly ariaLabel = signal<string | null | undefined>(undefined);
}

describe('formatBadgeContent Helper', () => {
  it('should return empty string for dot mode', () => {
    expect(formatBadgeContent(10, 99, true)).toBe('');
  });

  it('should return empty string for null/undefined/empty content', () => {
    expect(formatBadgeContent(null)).toBe('');
    expect(formatBadgeContent(undefined)).toBe('');
    expect(formatBadgeContent('')).toBe('');
  });

  it('should format number within max threshold', () => {
    expect(formatBadgeContent(5, 99)).toBe('5');
    expect(formatBadgeContent(99, 99)).toBe('99');
  });

  it('should clamp numbers exceeding max threshold with +', () => {
    expect(formatBadgeContent(100, 99)).toBe('99+');
    expect(formatBadgeContent(1000, 999)).toBe('999+');
  });

  it('should parse numeric string values and clamp if exceeding max', () => {
    expect(formatBadgeContent('150', 99)).toBe('99+');
    expect(formatBadgeContent('42', 99)).toBe('42');
  });

  it('should keep non-numeric strings as is', () => {
    expect(formatBadgeContent('NEW', 99)).toBe('NEW');
    expect(formatBadgeContent('PRO', 99)).toBe('PRO');
  });
});

describe('TalosBadgeDirective Suite', () => {
  let fixture: ComponentFixture<TestBadgeHostComponent>;
  let host: TestBadgeHostComponent;
  let hostButton: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TalosBadgeDirective, TestBadgeHostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestBadgeHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
    hostButton = fixture.nativeElement.querySelector('#test-btn');
  });

  it('should attach a badge element to the host button', () => {
    expect(hostButton).toBeTruthy();
    expect(hostButton.classList.contains('talos-badge-host')).toBe(true);
    expect(hostButton.classList.contains('talos-badge-host--has-badge')).toBe(true);

    const badge = hostButton.querySelector('.talos-badge');
    expect(badge).toBeTruthy();
    expect(badge?.textContent).toBe('5');
    expect(badge?.classList.contains('talos-badge--md')).toBe(true);
    expect(badge?.classList.contains('talos-badge--top-right')).toBe(true);
    expect(badge?.classList.contains('talos-badge--primary')).toBe(true);
  });

  it('should clamp content exceeding max threshold with + suffix', () => {
    host.content.set(150);
    host.max.set(99);
    fixture.detectChanges();

    const badge = hostButton.querySelector('.talos-badge');
    expect(badge?.textContent).toBe('99+');
    expect(badge?.classList.contains('talos-badge--pill')).toBe(true);
  });

  it('should render exact value when within max threshold', () => {
    host.content.set(42);
    host.max.set(99);
    fixture.detectChanges();

    const badge = hostButton.querySelector('.talos-badge');
    expect(badge?.textContent).toBe('42');
  });

  it('should render correctly in dot mode', () => {
    host.dot.set(true);
    fixture.detectChanges();

    const badge = hostButton.querySelector('.talos-badge');
    expect(badge?.textContent).toBe('');
    expect(badge?.classList.contains('talos-badge--dot')).toBe(true);
  });

  it('should support size configurations: xs, sm, md, lg', () => {
    const sizes: TalosBadgeSize[] = ['xs', 'sm', 'md', 'lg'];

    for (const s of sizes) {
      host.size.set(s);
      fixture.detectChanges();
      const badge = hostButton.querySelector('.talos-badge');
      expect(badge?.classList.contains(`talos-badge--${s}`)).toBe(true);
    }
  });

  it('should support position configurations', () => {
    const positions: TalosBadgePosition[] = [
      'top-left',
      'top-right',
      'bottom-left',
      'bottom-right',
      'inline'
    ];

    for (const pos of positions) {
      host.position.set(pos);
      fixture.detectChanges();
      const badge = hostButton.querySelector('.talos-badge');
      expect(badge?.classList.contains(`talos-badge--${pos}`)).toBe(true);
    }
  });

  it('should support visual color variants', () => {
    const variants: TalosBadgeVariant[] = [
      'danger',
      'success',
      'warning',
      'info',
      'subtle',
      'outline'
    ];

    for (const v of variants) {
      host.variant.set(v);
      fixture.detectChanges();
      const badge = hostButton.querySelector('.talos-badge');
      expect(badge?.classList.contains(`talos-badge--${v}`)).toBe(true);
    }
  });

  it('should toggle pulse animation class', () => {
    host.pulse.set(true);
    fixture.detectChanges();

    let badge = hostButton.querySelector('.talos-badge');
    expect(badge?.classList.contains('talos-badge--pulse')).toBe(true);

    host.pulse.set(false);
    fixture.detectChanges();

    badge = hostButton.querySelector('.talos-badge');
    expect(badge?.classList.contains('talos-badge--pulse')).toBe(false);
  });

  it('should hide badge when hidden input is true or content is null', () => {
    host.hidden.set(true);
    fixture.detectChanges();

    let badge = hostButton.querySelector('.talos-badge') as HTMLElement | null;
    expect(badge?.classList.contains('talos-badge--hidden') || badge?.style.display === 'none').toBe(true);
    expect(hostButton.classList.contains('talos-badge-host--has-badge')).toBe(false);

    host.hidden.set(false);
    host.content.set(null);
    fixture.detectChanges();

    badge = hostButton.querySelector('.talos-badge') as HTMLElement | null;
    expect(badge?.classList.contains('talos-badge--hidden') || badge?.style.display === 'none').toBe(true);
  });

  it('should set aria-label on host when provided', () => {
    host.ariaLabel.set('5 unread notifications');
    fixture.detectChanges();

    expect(hostButton.getAttribute('aria-label')).toBe('5 unread notifications');
  });
});
