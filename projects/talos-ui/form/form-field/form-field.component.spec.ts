import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TalosFormFieldComponent } from './form-field.component';
import { TalosInputDirective } from '../input/input.directive';

@Component({
  imports: [TalosFormFieldComponent, TalosInputDirective, ReactiveFormsModule],
  template: `
    <talos-form-field
      [label]="label()"
      [floating]="floating()"
      [hint]="hint()"
      [error]="error()"
      [required]="required()"
      [size]="size()"
    >
      <input talosInput [formControl]="control" placeholder="Enter text" />
    </talos-form-field>
  `
})
class TestFormFieldHostComponent {
  readonly label = signal('Username');
  readonly floating = signal(false);
  readonly hint = signal('Helper text');
  readonly error = signal('');
  readonly required = signal(true);
  readonly size = signal<'sm' | 'md' | 'lg'>('md');
  readonly control = new FormControl('');
}

describe('TalosFormFieldComponent', () => {
  let fixture: ComponentFixture<TestFormFieldHostComponent>;
  let host: TestFormFieldHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestFormFieldHostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestFormFieldHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render static label by default', () => {
    const labelEl = fixture.nativeElement.querySelector('.talos-field-label');
    expect(labelEl).toBeTruthy();
    expect(labelEl.textContent).toContain('Username');
    expect(fixture.nativeElement.querySelector('.talos-floating-label')).toBeFalsy();
  });

  it('should render floating label when floating is true', () => {
    host.floating.set(true);
    fixture.detectChanges();

    const floatingLabelEl = fixture.nativeElement.querySelector('.talos-floating-label');
    expect(floatingLabelEl).toBeTruthy();
    expect(floatingLabelEl.textContent).toContain('Username');
    expect(fixture.nativeElement.querySelector('.talos-field-label')).toBeFalsy();
  });

  it('should float label when input has value in floating mode', () => {
    host.floating.set(true);
    fixture.detectChanges();

    const inputEl: HTMLInputElement = fixture.nativeElement.querySelector('input');
    inputEl.value = 'john_doe';
    inputEl.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();

    const floatingLabelEl = fixture.nativeElement.querySelector('.talos-floating-label');
    expect(floatingLabelEl.classList.contains('is-floated')).toBe(true);
  });

  it('should display error when error input is provided', () => {
    host.error.set('Field is required');
    fixture.detectChanges();

    const errorEl = fixture.nativeElement.querySelector('.field-error');
    expect(errorEl).toBeTruthy();
    expect(errorEl.textContent).toContain('Field is required');
  });

  it('should display hint when no error is present', () => {
    const hintEl = fixture.nativeElement.querySelector('.field-help');
    expect(hintEl).toBeTruthy();
    expect(hintEl.textContent).toContain('Helper text');
  });
});
