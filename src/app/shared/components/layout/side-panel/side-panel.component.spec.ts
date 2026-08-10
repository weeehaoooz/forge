import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, input } from '@angular/core';
import { SidePanelComponent } from './side-panel.component';

@Component({
  template: `<div>Dynamic content for {{ name() }}</div>`
})
class DummyContentComponent {
  readonly name = input<string>('World');
}

describe('SidePanelComponent', () => {
  let component: SidePanelComponent;
  let fixture: ComponentFixture<SidePanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidePanelComponent, DummyContentComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SidePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the title and close button', () => {
    fixture.componentRef.setInput('title', 'Test Panel Title');
    fixture.detectChanges();

    const titleEl = fixture.nativeElement.querySelector('.side-panel-title');
    expect(titleEl.textContent.trim()).toBe('Test Panel Title');
  });

  it('should apply correct host classes based on mode input', () => {
    const hostEl = fixture.nativeElement as HTMLElement;
    expect(hostEl.classList.contains('is-overlay')).toBe(true);
    expect(hostEl.classList.contains('is-inline')).toBe(false);

    fixture.componentRef.setInput('mode', 'inline');
    fixture.detectChanges();

    expect(hostEl.classList.contains('is-overlay')).toBe(false);
    expect(hostEl.classList.contains('is-inline')).toBe(true);
  });

  it('should emit close event when close button is clicked', () => {
    let closed = false;
    component.close.subscribe(() => {
      closed = true;
    });

    const closeBtn = fixture.nativeElement.querySelector('.side-panel-close-btn');
    closeBtn.click();

    expect(closed).toBe(true);
  });

  it('should render dynamic component when component input is provided', () => {
    fixture.componentRef.setInput('component', DummyContentComponent);
    fixture.componentRef.setInput('componentInputs', { name: 'Angular' });
    fixture.detectChanges();

    const contentEl = fixture.nativeElement.querySelector('.side-panel-body');
    expect(contentEl.textContent).toContain('Dynamic content for Angular');
  });
});
