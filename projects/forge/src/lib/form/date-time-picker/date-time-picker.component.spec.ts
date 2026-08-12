import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import moment from 'moment';
import { DateTimePickerComponent } from './date-time-picker.component';

describe('DateTimePickerComponent', () => {
  let component: DateTimePickerComponent;
  let fixture: ComponentFixture<DateTimePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DateTimePickerComponent, ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(DateTimePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create date time picker component', () => {
    expect(component).toBeTruthy();
  });

  it('should format initial string date-time value with ControlValueAccessor writeValue', () => {
    component.writeValue('2026-08-15 14:30');
    fixture.detectChanges();
    expect(component.formattedValue()).toBe('2026-08-15 14:30');
    expect(component.selectedDateTime()?.format('YYYY-MM-DD HH:mm')).toBe('2026-08-15 14:30');
  });

  it('should adjust hours and minutes via time controls', () => {
    component.writeValue('2026-08-15 10:00');
    component.open();
    fixture.detectChanges();

    component.adjustHour(2); // 10 -> 12
    fixture.detectChanges();
    expect(component.draftHour()).toBe(12);

    component.adjustMinute(15); // 0 -> 15
    fixture.detectChanges();
    expect(component.draftMinute()).toBe(15);

    expect(component.formattedValue()).toBe('2026-08-15 12:15');
  });

  it('should support clear action', () => {
    let emitted: unknown = 'init';
    component.registerOnChange((val) => (emitted = val));
    component.writeValue('2026-08-15 14:30');
    fixture.detectChanges();

    const mockEvent = new MouseEvent('click');
    component.onClear(mockEvent);
    fixture.detectChanges();

    expect(component.selectedDateTime()).toBeNull();
    expect(emitted).toBeNull();
  });
});
