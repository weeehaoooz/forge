import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { describe, beforeEach, it, expect } from 'vitest';
import { TalosCheckboxDirective } from './checkbox.directive';
import { TalosCheckboxGroupDirective } from './checkbox-group.directive';
import { TalosCheckboxParentDirective } from './checkbox-parent.directive';
import { TalosCheckboxGroupComponent } from './checkbox-group.component';
import { TalosCheckboxComponent } from './checkbox.component';
import { TalosCheckboxModule } from './checkbox.module';

@Component({
  imports: [TalosCheckboxModule, ReactiveFormsModule],
  template: `
    <div talosCheckboxGroup [formControl]="fruitControl" #fruitGroup="talosCheckboxGroup">
      <input
        id="parent-select-all"
        type="checkbox"
        talosCheckbox
        talosCheckboxParent
        [group]="fruitGroup"
        [values]="['apple', 'banana', 'cherry']"
      />

      <input id="apple-chk" type="checkbox" talosCheckbox value="apple" />
      <input id="banana-chk" type="checkbox" talosCheckbox value="banana" />
      <input id="cherry-chk" type="checkbox" talosCheckbox value="cherry" />
    </div>

    <talos-checkbox-group [formControl]="componentGroupControl">
      <talos-checkbox value="option1">Option 1</talos-checkbox>
      <talos-checkbox value="option2">Option 2</talos-checkbox>
    </talos-checkbox-group>
  `
})
class TestHostComponent {
  fruitControl = new FormControl<string[]>(['apple']);
  componentGroupControl = new FormControl<string[]>(['option1']);
}

describe('Talos Checkbox Group & Parent Directives Suite', () => {
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

  it('should initialize group with form control values', () => {
    const appleEl = fixture.nativeElement.querySelector('#apple-chk') as HTMLInputElement;
    const bananaEl = fixture.nativeElement.querySelector('#banana-chk') as HTMLInputElement;
    const cherryEl = fixture.nativeElement.querySelector('#cherry-chk') as HTMLInputElement;

    expect(appleEl.checked).toBe(true);
    expect(bananaEl.checked).toBe(false);
    expect(cherryEl.checked).toBe(false);
  });

  it('should set parent checkbox to indeterminate state when partially selected', () => {
    const parentEl = fixture.nativeElement.querySelector('#parent-select-all') as HTMLInputElement;

    expect(parentEl.checked).toBe(false);
    expect(parentEl.indeterminate).toBe(true);
    expect(parentEl.classList.contains('is-indeterminate')).toBe(true);
  });

  it('should select all children when parent checkbox is toggled from indeterminate state', () => {
    const parentEl = fixture.nativeElement.querySelector('#parent-select-all') as HTMLInputElement;

    parentEl.click();
    fixture.detectChanges();

    expect(hostComponent.fruitControl.value).toEqual(['apple', 'banana', 'cherry']);
    expect(parentEl.checked).toBe(true);
    expect(parentEl.indeterminate).toBe(false);
  });

  it('should deselect all children when parent checkbox is toggled while all selected', () => {
    hostComponent.fruitControl.setValue(['apple', 'banana', 'cherry']);
    fixture.detectChanges();

    const parentEl = fixture.nativeElement.querySelector('#parent-select-all') as HTMLInputElement;
    expect(parentEl.checked).toBe(true);
    expect(parentEl.indeterminate).toBe(false);

    parentEl.click();
    fixture.detectChanges();

    expect(hostComponent.fruitControl.value).toEqual([]);
    expect(parentEl.checked).toBe(false);
    expect(parentEl.indeterminate).toBe(false);
  });

  it('should update group control value when individual child checkbox is clicked', () => {
    const bananaEl = fixture.nativeElement.querySelector('#banana-chk') as HTMLInputElement;

    bananaEl.click();
    fixture.detectChanges();

    expect(hostComponent.fruitControl.value).toEqual(['apple', 'banana']);
  });

  it('should work with TalosCheckboxComponent and TalosCheckboxGroupComponent', () => {
    expect(hostComponent.componentGroupControl.value).toEqual(['option1']);

    const checkboxes = fixture.nativeElement.querySelectorAll('talos-checkbox input[type="checkbox"]');
    expect(checkboxes.length).toBe(2);
    expect((checkboxes[0] as HTMLInputElement).checked).toBe(true);
    expect((checkboxes[1] as HTMLInputElement).checked).toBe(false);

    (checkboxes[1] as HTMLInputElement).click();
    fixture.detectChanges();

    expect(hostComponent.componentGroupControl.value).toEqual(['option1', 'option2']);
  });
});
