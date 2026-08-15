import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DateRangePickerComponent } from './date-range-picker.component';
import { DateRangeValue } from './date-range-types';

describe('DateRangePickerComponent', () => {
  let component: DateRangePickerComponent;
  let fixture: ComponentFixture<DateRangePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DateRangePickerComponent, ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(DateRangePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create date range picker component', () => {
    expect(component).toBeTruthy();
  });

  it('should format initial string date range with ControlValueAccessor writeValue', () => {
    const range: DateRangeValue = {
      startDate: '2026-08-01',
      endDate: '2026-08-10'
    };
    component.writeValue(range);
    fixture.detectChanges();

    expect(component.selectedStartDate()).toBeTruthy();
    expect(component.selectedEndDate()).toBeTruthy();
    expect(component.formattedTriggerValue()).toContain('2026-08-01');
    expect(component.formattedTriggerValue()).toContain('2026-08-10');
  });

  it('should toggle dropdown state on trigger click', () => {
    expect(component.isOpen()).toBe(false);
    component.toggleOpen();
    fixture.detectChanges();
    expect(component.isOpen()).toBe(true);
    component.toggleOpen();
    fixture.detectChanges();
    expect(component.isOpen()).toBe(false);
  });

  it('should apply preset and update draft selection', () => {
    component.open();
    fixture.detectChanges();

    const presets = component.effectivePresets();
    const todayPreset = presets.find((p) => p.key === 'today');
    expect(todayPreset).toBeTruthy();

    if (todayPreset) {
      component.applyPreset(todayPreset);
      fixture.detectChanges();
      expect(component.draftStartDate()).toBeTruthy();
      expect(component.draftEndDate()).toBeTruthy();
    }
  });

  it('should handle clear action', () => {
    let emittedValue: unknown = 'init';
    component.registerOnChange((val) => (emittedValue = val));
    component.writeValue({
      startDate: '2026-08-01',
      endDate: '2026-08-10'
    });
    fixture.detectChanges();

    const mockEvent = new MouseEvent('click');
    component.onClear(mockEvent);
    fixture.detectChanges();

    expect(component.selectedStartDate()).toBeNull();
    expect(component.selectedEndDate()).toBeNull();
    expect(emittedValue).toBeNull();
  });
});
