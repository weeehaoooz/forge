import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TalosCardComponent } from './card.component';
import { TalosCardHeaderComponent } from './card-header.component';
import { TalosCardBodyComponent } from './card-body.component';
import { TalosCardFooterComponent } from './card-footer.component';
import {
  TalosCardActionsDirective,
  TalosCardAvatarDirective,
  TalosCardSubtitleDirective,
  TalosCardTitleDirective
} from './card.directives';

@Component({
  imports: [
    TalosCardComponent,
    TalosCardHeaderComponent,
    TalosCardBodyComponent,
    TalosCardFooterComponent,
    TalosCardTitleDirective,
    TalosCardSubtitleDirective,
    TalosCardAvatarDirective,
    TalosCardActionsDirective
  ],
  template: `
    <talos-card
      [variant]="variant()"
      [padding]="padding()"
      [clickable]="clickable()"
      [hoverable]="hoverable()"
      [selected]="selected()"
      [disabled]="disabled()"
      (cardClick)="onCardClick($event)"
    >
      <talos-card-header [title]="headerTitle()" [subtitle]="headerSubtitle()" [bordered]="headerBordered()">
        <div talosCardAvatar class="custom-avatar">AV</div>
        <span talosCardTitle class="custom-title-directive">Custom Directive Title</span>
        <span talosCardSubtitle class="custom-subtitle-directive">Custom Directive Subtitle</span>
        <div talosCardActions class="custom-actions">
          <button type="button">Action</button>
        </div>
      </talos-card-header>

      <talos-card-body>
        <p class="body-text">Main card content goes here.</p>
      </talos-card-body>

      <talos-card-footer [bordered]="footerBordered()" [align]="footerAlign()">
        <button type="button" class="footer-btn">Submit</button>
      </talos-card-footer>
    </talos-card>
  `
})
class TestCardHostComponent {
  readonly variant = signal<'elevated' | 'outlined' | 'flat' | 'filled'>('elevated');
  readonly padding = signal<'none' | 'sm' | 'md' | 'lg'>('md');
  readonly clickable = signal<boolean>(false);
  readonly hoverable = signal<boolean>(false);
  readonly selected = signal<boolean>(false);
  readonly disabled = signal<boolean>(false);
  readonly headerTitle = signal<string>('Card Title');
  readonly headerSubtitle = signal<string>('Card Subtitle');
  readonly headerBordered = signal<boolean>(false);
  readonly footerBordered = signal<boolean>(false);
  readonly footerAlign = signal<'start' | 'center' | 'end' | 'between'>('end');

  readonly clicked = signal<boolean>(false);
  onCardClick(_event: MouseEvent | KeyboardEvent): void {
    this.clicked.set(true);
  }
}

describe('TalosCardComponent & Subcomponents', () => {
  let hostFixture: ComponentFixture<TestCardHostComponent>;
  let hostComponent: TestCardHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestCardHostComponent]
    }).compileComponents();

    hostFixture = TestBed.createComponent(TestCardHostComponent);
    hostComponent = hostFixture.componentInstance;
    hostFixture.detectChanges();
  });

  it('should render card host with default elevated variant and md padding', () => {
    const cardEl = hostFixture.nativeElement.querySelector('talos-card');
    expect(cardEl).toBeTruthy();
    expect(cardEl.classList.contains('talos-card-elevated')).toBe(true);
    expect(cardEl.classList.contains('talos-card-padding-md')).toBe(true);
  });

  it('should apply variant and padding classes dynamically', () => {
    hostComponent.variant.set('outlined');
    hostComponent.padding.set('lg');
    hostFixture.detectChanges();

    const cardEl = hostFixture.nativeElement.querySelector('talos-card');
    expect(cardEl.classList.contains('talos-card-outlined')).toBe(true);
    expect(cardEl.classList.contains('talos-card-padding-lg')).toBe(true);
  });

  it('should render header with title, subtitle, avatar, and actions', () => {
    const titleEl = hostFixture.nativeElement.querySelector('.talos-card-title');
    const subtitleEl = hostFixture.nativeElement.querySelector('.talos-card-subtitle');
    const avatarEl = hostFixture.nativeElement.querySelector('.custom-avatar');
    const actionsEl = hostFixture.nativeElement.querySelector('.custom-actions');

    expect(titleEl.textContent.trim()).toBe('Card Title');
    expect(subtitleEl.textContent.trim()).toBe('Card Subtitle');
    expect(avatarEl).toBeTruthy();
    expect(actionsEl).toBeTruthy();
  });

  it('should toggle header and footer bordered classes', () => {
    hostComponent.headerBordered.set(true);
    hostComponent.footerBordered.set(true);
    hostFixture.detectChanges();

    const headerEl = hostFixture.nativeElement.querySelector('talos-card-header');
    const footerEl = hostFixture.nativeElement.querySelector('talos-card-footer');

    expect(headerEl.classList.contains('is-bordered')).toBe(true);
    expect(footerEl.classList.contains('is-bordered')).toBe(true);
  });

  it('should render card body projected content', () => {
    const bodyTextEl = hostFixture.nativeElement.querySelector('.body-text');
    expect(bodyTextEl).toBeTruthy();
    expect(bodyTextEl.textContent).toContain('Main card content goes here.');
  });

  it('should apply footer alignment class', () => {
    hostComponent.footerAlign.set('between');
    hostFixture.detectChanges();

    const footerEl = hostFixture.nativeElement.querySelector('talos-card-footer');
    expect(footerEl.classList.contains('align-between')).toBe(true);
  });

  it('should handle clickable card click event', () => {
    hostComponent.clickable.set(true);
    hostFixture.detectChanges();

    const cardEl = hostFixture.nativeElement.querySelector('talos-card');
    expect(cardEl.getAttribute('role')).toBe('button');
    expect(cardEl.getAttribute('tabindex')).toBe('0');

    cardEl.click();
    expect(hostComponent.clicked()).toBe(true);
  });

  it('should handle keyboard Enter activation on clickable card', () => {
    hostComponent.clickable.set(true);
    hostFixture.detectChanges();

    const cardEl = hostFixture.nativeElement.querySelector('talos-card');
    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
    cardEl.dispatchEvent(enterEvent);

    expect(hostComponent.clicked()).toBe(true);
  });

  it('should not emit cardClick when disabled', () => {
    hostComponent.clickable.set(true);
    hostComponent.disabled.set(true);
    hostFixture.detectChanges();

    const cardEl = hostFixture.nativeElement.querySelector('talos-card');
    expect(cardEl.classList.contains('is-disabled')).toBe(true);
    expect(cardEl.getAttribute('tabindex')).toBe('-1');

    cardEl.click();
    expect(hostComponent.clicked()).toBe(false);
  });
});
