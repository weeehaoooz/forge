import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { TalosSnackbarComponent } from './snackbar.component';

import { TalosSnackbarInstance } from './snackbar.types';

describe('TalosSnackbarComponent', () => {
  let component: TalosSnackbarComponent;
  let fixture: ComponentFixture<TalosSnackbarComponent>;

  const mockInstance: TalosSnackbarInstance = {
    id: 'test-1',
    message: 'Operation finished',
    title: 'Notice',
    variant: 'success',
    position: 'bottom-right',
    duration: 4000,
    dismissible: true,
    showProgressBar: true,
    pauseOnHover: true,
    icon: true,
    createdAt: Date.now(),
    isPaused: false
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TalosSnackbarComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TalosSnackbarComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('instance', mockInstance);
    fixture.detectChanges();
  });

  it('should create and render message & title', () => {
    expect(component).toBeTruthy();

    const titleEl = fixture.nativeElement.querySelector('.talos-snackbar-title');
    const msgEl = fixture.nativeElement.querySelector('.talos-snackbar-message');

    expect(titleEl.textContent.trim()).toBe('Notice');
    expect(msgEl.textContent.trim()).toBe('Operation finished');
  });

  it('should apply variant class correctly', () => {
    const snackbarEl = fixture.nativeElement.querySelector('.talos-snackbar');
    expect(snackbarEl.classList.contains('variant-success')).toBe(true);
  });

  it('should set appropriate aria attributes', () => {
    const snackbarEl = fixture.nativeElement.querySelector('.talos-snackbar');
    expect(snackbarEl.getAttribute('role')).toBe('status');
    expect(snackbarEl.getAttribute('aria-live')).toBe('polite');
  });
});
