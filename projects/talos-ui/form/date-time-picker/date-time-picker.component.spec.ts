import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
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
    expect(component.currentValue()).toBe('2026-08-15 14:30');
  });

  it('should trigger onDateChange and notify form control onChange', () => {
    let emitted: unknown = null;
    component.registerOnChange((val) => (emitted = val));
    component.onDateChange('2026-08-15 12:15');
    fixture.detectChanges();

    expect(component.currentValue()).toBe('2026-08-15 12:15');
    expect(emitted).toBe('2026-08-15 12:15');
  });
});
