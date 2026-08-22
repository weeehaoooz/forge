import { describe, it, expect, beforeEach } from 'vitest';
import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  TalosButtonGroupComponent,
  ButtonGroupOrientation,
  ButtonGroupVariant,
  ButtonGroupSelectionMode
} from './button-group.component';
import { TalosButtonGroupItemDirective } from '../button-group-item/button-group-item.directive';
import { TalosButtonDirective } from '@talos/components/button';
import { TalosTooltipDirective } from '@talos/components/tooltip';

@Component({
  imports: [
    TalosButtonGroupComponent,
    TalosButtonGroupItemDirective,
    TalosButtonDirective,
    TalosTooltipDirective
  ],
  template: `
    <talos-button-group
      [orientation]="orientation()"
      [variant]="variant()"
      [selectionMode]="selectionMode()"
      [(value)]="selectedValue"
    >
      <button talosButton talosButtonGroupItem [value]="'grid'" tooltip="Grid View">Grid</button>
      <button talosButton talosButtonGroupItem [value]="'feed'" tooltip="Feed View">Feed</button>
      <button talosButton talosButtonGroupItem [value]="'stack'" tooltip="Stack View">Stack</button>
    </talos-button-group>
  `
})
class TestButtonGroupHostComponent {
  readonly orientation = signal<ButtonGroupOrientation>('horizontal');
  readonly variant = signal<ButtonGroupVariant>('attached');
  readonly selectionMode = signal<ButtonGroupSelectionMode>('single');
  selectedValue = signal<string>('grid');
}

describe('TalosButtonGroupComponent', () => {
  let fixture: ComponentFixture<TestButtonGroupHostComponent>;
  let hostComponent: TestButtonGroupHostComponent;
  let groupEl: HTMLElement;
  let buttons: HTMLButtonElement[];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TalosButtonGroupComponent,
        TalosButtonGroupItemDirective,
        TalosButtonDirective,
        TalosTooltipDirective,
        TestButtonGroupHostComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TestButtonGroupHostComponent);
    hostComponent = fixture.componentInstance;
    fixture.detectChanges();
    groupEl = fixture.nativeElement.querySelector('talos-button-group');
    buttons = Array.from(fixture.nativeElement.querySelectorAll('button'));
  });

  it('should apply correct base host classes and default orientation', () => {
    expect(groupEl.classList.contains('talos-button-group')).toBe(true);
    expect(groupEl.classList.contains('talos-button-group-horizontal')).toBe(true);
    expect(groupEl.classList.contains('talos-button-group-attached')).toBe(true);
    expect(groupEl.getAttribute('role')).toBe('radiogroup');
  });

  it('should update classes when orientation changes to vertical', () => {
    hostComponent.orientation.set('vertical');
    fixture.detectChanges();

    expect(groupEl.classList.contains('talos-button-group-vertical')).toBe(true);
    expect(groupEl.classList.contains('talos-button-group-horizontal')).toBe(false);
    expect(groupEl.getAttribute('aria-orientation')).toBe('vertical');
  });

  it('should update classes when variant changes', () => {
    hostComponent.variant.set('segmented');
    fixture.detectChanges();

    expect(groupEl.classList.contains('talos-button-group-segmented')).toBe(true);
  });

  it('should select button and update value on click', () => {
    expect(buttons[0].classList.contains('is-selected')).toBe(true);

    buttons[1].click();
    fixture.detectChanges();

    expect(buttons[1].classList.contains('is-selected')).toBe(true);
    expect(buttons[0].classList.contains('is-selected')).toBe(false);
    expect(hostComponent.selectedValue()).toBe('feed');
  });

  it('should handle keyboard navigation with arrow keys', () => {
    buttons[0].focus();
    expect(document.activeElement).toBe(buttons[0]);

    const keyEvent = new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true });
    groupEl.dispatchEvent(keyEvent);
    fixture.detectChanges();

    expect(document.activeElement).toBe(buttons[1]);
  });
});
