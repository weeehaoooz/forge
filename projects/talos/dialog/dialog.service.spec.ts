import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TalosDialogService } from './dialog.service';
import { TalosDialogModule } from './dialog.module';

@Component({
  template: `
    <talos-dialog-header title="Test Dialog" />
    <talos-dialog-content>Modal test content</talos-dialog-content>
    <talos-dialog-footer>
      <button [talosDialogClose]="'closed_result'">Close</button>
    </talos-dialog-footer>
  `,
  imports: [TalosDialogModule]
})
class TestModalComponent {}

describe('TalosDialogService', () => {
  let service: TalosDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TalosDialogService);
  });

  afterEach(() => {
    service.closeAll();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should open a component modal and return a TalosDialogRef', () => {
    const ref = service.open(TestModalComponent, {
      size: 'md',
      backdropBlur: 'md',
      data: { testId: 42 }
    });

    expect(ref).toBeTruthy();
    expect(ref.id).toBeTruthy();
    expect(ref.data).toEqual({ testId: 42 });
    expect(service.openDialogs().length).toBe(1);

    ref.close('result');
    expect(service.openDialogs().length).toBe(0);
  });

  it('should open a confirmation dialog via confirm()', () => {
    const ref = service.confirm({
      title: 'Confirm Delete',
      message: 'Are you sure?',
      variant: 'danger',
      confirmText: 'Delete',
      backdropBlur: true
    });

    expect(ref).toBeTruthy();
    expect(service.openDialogs().length).toBe(1);

    ref.close(true);
    expect(service.openDialogs().length).toBe(0);
  });

  it('should open an alert dialog via alert()', () => {
    const ref = service.alert({
      title: 'Notice',
      message: 'Operation finished',
      variant: 'info'
    });

    expect(ref).toBeTruthy();
    expect(service.openDialogs().length).toBe(1);

    ref.close();
    expect(service.openDialogs().length).toBe(0);
  });

  it('should close all dialogs via closeAll()', () => {
    service.open(TestModalComponent);
    service.open(TestModalComponent);
    expect(service.openDialogs().length).toBe(2);

    service.closeAll();
    expect(service.openDialogs().length).toBe(0);
  });
});
