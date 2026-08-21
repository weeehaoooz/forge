import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { TalosAlertComponent } from './alert.component';

describe('TalosAlertComponent', () => {
  let component: TalosAlertComponent;
  let fixture: ComponentFixture<TalosAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TalosAlertComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TalosAlertComponent);
    component = fixture.componentInstance;
  });

  it('should create with default success severity and render message & title', () => {
    fixture.componentRef.setInput('title', 'System Healthy');
    fixture.componentRef.setInput('message', 'All services operational');
    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(component.severity()).toBe('success');
    expect(component.resolvedVariant()).toBe('success');

    const titleEl = fixture.nativeElement.querySelector('.talos-alert-title');
    const msgEl = fixture.nativeElement.querySelector('.talos-alert-message');

    expect(titleEl.textContent.trim()).toBe('System Healthy');
    expect(msgEl.textContent.trim()).toContain('All services operational');
  });

  it('should apply variant and appearance classes correctly', () => {
    fixture.componentRef.setInput('severity', 'error');
    fixture.componentRef.setInput('appearance', 'accent');
    fixture.detectChanges();

    const alertEl = fixture.nativeElement.querySelector('.talos-alert');
    expect(alertEl.classList.contains('variant-error')).toBe(true);
    expect(alertEl.classList.contains('appearance-accent')).toBe(true);
  });

  it('should render severity badge when enabled', () => {
    fixture.componentRef.setInput('severity', 'error');
    fixture.componentRef.setInput('showSeverityBadge', true);
    fixture.detectChanges();

    const badgeEl = fixture.nativeElement.querySelector('.talos-alert-severity-badge');
    expect(badgeEl).toBeTruthy();
    expect(badgeEl.textContent.trim()).toBe('ERROR');
  });

  it('should set appropriate aria attributes based on severity', () => {
    fixture.componentRef.setInput('severity', 'error');
    fixture.detectChanges();

    const alertEl = fixture.nativeElement.querySelector('.talos-alert');
    expect(alertEl.getAttribute('role')).toBe('alert');
    expect(alertEl.getAttribute('aria-live')).toBe('assertive');
  });
});
