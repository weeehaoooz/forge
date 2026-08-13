import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ForgeSnackbarService } from './snackbar.service';


describe('ForgeSnackbarService', () => {
  let service: ForgeSnackbarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ForgeSnackbarService);
    service.dismissAll();
  });

  afterEach(() => {
    service.dismissAll();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add snackbar instance on show()', () => {
    const ref = service.show('Test message', { title: 'Test Title' });
    expect(ref.id).toBeTruthy();

    const active = service.snackbars();
    expect(active.length).toBe(1);
    expect(active[0].message).toBe('Test message');
    expect(active[0].title).toBe('Test Title');
  });

  it('should handle convenience methods (success, error, warning, info)', () => {
    service.success('Success message');
    service.error('Error message');
    service.warning('Warning message');
    service.info('Info message');

    const active = service.snackbars();
    expect(active.length).toBe(4);
    expect(active[0].variant).toBe('success');
    expect(active[1].variant).toBe('error');
    expect(active[2].variant).toBe('warning');
    expect(active[3].variant).toBe('info');
  });

  it('should dismiss specific snackbar by ID', () => {
    const ref1 = service.show('Message 1');
    const ref2 = service.show('Message 2');

    expect(service.snackbars().length).toBe(2);

    service.dismiss(ref1.id);
    expect(service.snackbars().length).toBe(1);
    expect(service.snackbars()[0].id).toBe(ref2.id);
  });

  it('should dismiss all snackbars via dismissAll()', () => {
    service.show('Message 1');
    service.show('Message 2');
    service.show('Message 3');

    expect(service.snackbars().length).toBe(3);

    service.dismissAll();
    expect(service.snackbars().length).toBe(0);
  });
});
