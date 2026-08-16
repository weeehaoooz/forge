import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { describe, beforeEach, it, expect } from 'vitest';
import { TalosInputDirective, InputSize } from './input.directive';

@Component({
  imports: [TalosInputDirective, ReactiveFormsModule],
  template: `
    <input
      id="test-input"
      talosInput
      [formControl]="inputControl"
      [size]="inputSize()"
      [invalid]="isInvalid()"
    />

    <textarea
      id="test-textarea"
      talosTextarea
      [formControl]="textareaControl"
      [size]="textareaSize()"
      [invalid]="isInvalid()"
    ></textarea>
  `
})
class TestHostComponent {
  inputControl = new FormControl<string>('');
  textareaControl = new FormControl<string>('');
  inputSize = signal<InputSize>('md');
  textareaSize = signal<InputSize>('lg');
  isInvalid = signal<boolean>(false);
}

describe('TalosInputDirective Suite', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should apply base talos-input class to input and textarea', () => {
    const inputEl = fixture.nativeElement.querySelector('#test-input') as HTMLInputElement;
    const textareaEl = fixture.nativeElement.querySelector('#test-textarea') as HTMLTextAreaElement;

    expect(inputEl.classList.contains('talos-input')).toBe(true);
    expect(textareaEl.classList.contains('talos-input')).toBe(true);
  });

  it('should apply size classes dynamically', () => {
    const inputEl = fixture.nativeElement.querySelector('#test-input') as HTMLInputElement;
    const textareaEl = fixture.nativeElement.querySelector('#test-textarea') as HTMLTextAreaElement;

    expect(inputEl.classList.contains('input-md')).toBe(true);
    expect(textareaEl.classList.contains('input-lg')).toBe(true);

    hostComponent.inputSize.set('sm');
    fixture.detectChanges();

    expect(inputEl.classList.contains('input-sm')).toBe(true);
  });

  it('should apply is-invalid class when invalid property is true', () => {
    const inputEl = fixture.nativeElement.querySelector('#test-input') as HTMLInputElement;

    expect(inputEl.classList.contains('is-invalid')).toBe(false);

    hostComponent.isInvalid.set(true);
    fixture.detectChanges();

    expect(inputEl.classList.contains('is-invalid')).toBe(true);
  });
});
