import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { LayoutService } from './layout.service';

@Component({
  standalone: true,
  template: `<p>Test Component</p>`
})
class DummyTestComponent { }

describe('LayoutService Suite', () => {
  let service: LayoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LayoutService]
    });
    service = TestBed.inject(LayoutService);
  });

  it('should initialize with default states', () => {
    expect(service.isLeftNavCollapsed()).toBe(false);
    expect(service.isRightPanelOpen()).toBe(false);
    expect(service.isMainContentExpanded()).toBe(false);
    expect(service.shouldBlurMainContent()).toBe(false);
  });

  it('should toggle left nav collapse state', () => {
    service.toggleLeftNav();
    expect(service.isLeftNavCollapsed()).toBe(true);

    service.toggleLeftNav();
    expect(service.isLeftNavCollapsed()).toBe(false);
  });

  it('should open right panel dynamically with component and options', () => {
    service.openRightPanel(
      DummyTestComponent,
      { dataId: '123' },
      { title: 'Test Panel', blurBackdrop: true }
    );

    expect(service.isRightPanelOpen()).toBe(true);
    expect(service.rightPanelComponent()).toBe(DummyTestComponent);
    expect(service.rightPanelInputs()).toEqual({ dataId: '123' });
    expect(service.rightPanelOptions().title).toBe('Test Panel');
    expect(service.shouldBlurMainContent()).toBe(true);
  });

  it('should close right panel and clear state', () => {
    service.openRightPanel(DummyTestComponent, {}, { blurBackdrop: true });
    expect(service.isRightPanelOpen()).toBe(true);

    service.closeRightPanel();
    expect(service.isRightPanelOpen()).toBe(false);
    expect(service.rightPanelComponent()).toBeNull();
    expect(service.shouldBlurMainContent()).toBe(false);
  });
});
