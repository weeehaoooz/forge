import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TalosAlertService } from './alert.service';

describe('TalosAlertService', () => {
  let service: TalosAlertService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TalosAlertService);
    service.dismissAll();
  });

  afterEach(() => {
    service.dismissAll();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add alert instance on show() with default success severity', () => {
    const ref = service.show('System health optimal', {
      title: 'Health Check'
    });
    expect(ref.id).toBeTruthy();

    const active = service.alerts();
    expect(active.length).toBe(1);
    expect(active[0].message).toBe('System health optimal');
    expect(active[0].title).toBe('Health Check');
    expect(active[0].severity).toBe('success');
  });

  it('should handle convenience methods with 4 severities (success, info, warning, error)', () => {
    service.success('Success message');
    service.info('Info message');
    service.warning('Warning message');
    service.error('Error message');

    const active = service.alerts();
    expect(active.length).toBe(4);
    expect(active[0].severity).toBe('success');
    expect(active[1].severity).toBe('info');
    expect(active[2].severity).toBe('warning');
    expect(active[3].severity).toBe('error');
  });

  it('should support global banner alerts', () => {
    service.banner('Global maintenance banner');
    expect(service.bannerAlerts().length).toBe(1);
    expect(service.bannerAlerts()[0].message).toBe('Global maintenance banner');
    expect(service.bannerAlerts()[0].appearance).toBe('filled');
  });

  it('should dismiss specific alert by ID', () => {
    const ref1 = service.show('Alert 1');
    const ref2 = service.show('Alert 2');

    expect(service.alerts().length).toBe(2);

    service.dismiss(ref1.id);
    expect(service.alerts().length).toBe(1);
    expect(service.alerts()[0].id).toBe(ref2.id);
  });

  it('should dismiss all alerts via dismissAll()', () => {
    service.show('Alert 1');
    service.show('Alert 2');
    service.banner('Banner 1');

    expect(service.alerts().length).toBe(2);
    expect(service.bannerAlerts().length).toBe(1);

    service.dismissAll();
    expect(service.alerts().length).toBe(0);
    expect(service.bannerAlerts().length).toBe(0);
  });
});
