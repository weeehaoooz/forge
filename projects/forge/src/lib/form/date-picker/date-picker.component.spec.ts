import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import moment from 'moment';
import { DatePickerComponent } from './date-picker.component';

describe('DatePickerComponent', () => {
  let component: DatePickerComponent;
  let fixture: ComponentFixture<DatePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatePickerComponent, ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(DatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create date picker component', () => {
    expect(component).toBeTruthy();
  });

  it('should format initial string date value with ControlValueAccessor writeValue', () => {
    component.writeValue('2026-08-15');
    fixture.detectChanges();
    expect(component.formattedValue()).toBe('2026-08-15');
    expect(component.selectedDate()?.format('YYYY-MM-DD')).toBe('2026-08-15');
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

  it('should select date and update form control value', () => {
    const control = new FormControl('2026-08-01');
    component.registerOnChange((val) => control.setValue(val as string));

    component.writeValue('2026-08-01');
    component.open();
    fixture.detectChanges();

    const days = component.calendarDays();
    const dayToSelect = days.find((d) => d.isCurrentMonth && d.dayNumber === 20);
    expect(dayToSelect).toBeTruthy();

    if (dayToSelect) {
      component.selectDay(dayToSelect);
      fixture.detectChanges();
      expect(control.value).toBe('2026-08-20');
      expect(component.isOpen()).toBe(false);
    }
  });

  it('should handle clear action', () => {
    let emittedValue: unknown = 'init';
    component.registerOnChange((val) => (emittedValue = val));
    component.writeValue('2026-08-10');
    fixture.detectChanges();

    const mockEvent = new MouseEvent('click');
    component.onClear(mockEvent);
    fixture.detectChanges();

    expect(component.selectedDate()).toBeNull();
    expect(emittedValue).toBeNull();
  });
});
