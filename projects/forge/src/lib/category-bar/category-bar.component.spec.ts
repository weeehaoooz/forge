import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { ForgeCategoryBarComponent } from './category-bar.component';
import { CategoryBarSegment } from './category-bar.types';

describe('ForgeCategoryBarComponent', () => {
  let component: ForgeCategoryBarComponent;
  let fixture: ComponentFixture<ForgeCategoryBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForgeCategoryBarComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ForgeCategoryBarComponent);
    component = fixture.componentInstance;
  });

  it('should create the category bar component', () => {
    expect(component).toBeTruthy();
  });

  it('should render title and subtitle when provided', async () => {
    fixture.componentRef.setInput('title', 'Revenue Breakdown');
    fixture.componentRef.setInput('subtitle', 'Quarterly revenue distribution across products');
    fixture.detectChanges();
    await fixture.whenStable();

    const titleEl = fixture.nativeElement.querySelector('.forge-category-bar-title');
    const subtitleEl = fixture.nativeElement.querySelector('.forge-category-bar-subtitle');

    expect(titleEl?.textContent?.trim()).toBe('Revenue Breakdown');
    expect(subtitleEl?.textContent?.trim()).toBe('Quarterly revenue distribution across products');
  });

  it('should calculate segment percentages correctly based on values array', async () => {
    fixture.componentRef.setInput('values', [120, 80, 60, 40]);
    fixture.detectChanges();
    await fixture.whenStable();

    const segments = fixture.nativeElement.querySelectorAll('.forge-category-bar-segment');
    expect(segments.length).toBe(4);

    // Sum = 120 + 80 + 60 + 40 = 300
    // Segment 1 = 120 / 300 = 40%
    // Segment 2 = 80 / 300 = 26.666%
    // Segment 3 = 60 / 300 = 20%
    // Segment 4 = 40 / 300 = 13.333%
    expect(segments[0].style.width).toBe('40%');
    expect(segments[2].style.width).toBe('20%');
  });

  it('should render cumulative scale boundary labels', async () => {
    fixture.componentRef.setInput('values', [120, 80, 60, 40]);
    fixture.componentRef.setInput('showLabels', true);
    fixture.componentRef.setInput('labelPosition', 'top');
    fixture.detectChanges();
    await fixture.whenStable();

    const ticks = fixture.nativeElement.querySelectorAll('.forge-category-bar-label-tick');
    // Boundary points: 0, 120, 200, 260, 300 -> 5 labels
    expect(ticks.length).toBe(5);
    expect(ticks[0].textContent.trim()).toBe('0');
    expect(ticks[1].textContent.trim()).toBe('120');
    expect(ticks[2].textContent.trim()).toBe('200');
    expect(ticks[3].textContent.trim()).toBe('260');
    expect(ticks[4].textContent.trim()).toBe('300');
  });

  it('should place marker needle at the correct percentage position', async () => {
    fixture.componentRef.setInput('values', [120, 80, 60, 40]);
    fixture.componentRef.setInput('markerValue', 220);
    fixture.detectChanges();
    await fixture.whenStable();

    const markerEl = fixture.nativeElement.querySelector('.forge-category-bar-marker');
    expect(markerEl).toBeTruthy();

    // Total = 300, marker = 220 -> (220 / 300) * 100 = 73.3333%
    const leftStyle = markerEl.style.left;
    const percent = parseFloat(leftStyle);
    expect(percent).toBeCloseTo(73.33, 1);
  });

  it('should emit segmentClick when a segment is clicked', async () => {
    fixture.componentRef.setInput('values', [120, 80, 60, 40]);
    fixture.detectChanges();
    await fixture.whenStable();

    let clicked = false;
    component.segmentClick.subscribe(() => {
      clicked = true;
    });

    const segments = fixture.nativeElement.querySelectorAll('.forge-category-bar-segment');
    segments[0].click();
    fixture.detectChanges();

    expect(clicked).toBe(true);
  });

  it('should support rich categories input with custom colors', async () => {
    const cats: CategoryBarSegment[] = [
      { value: 50, label: 'Product A', color: '#ff0000' },
      { value: 50, label: 'Product B', color: '#00ff00' }
    ];
    fixture.componentRef.setInput('categories', cats);
    fixture.detectChanges();
    await fixture.whenStable();

    const segments = fixture.nativeElement.querySelectorAll('.forge-category-bar-segment');
    expect(segments.length).toBe(2);
    expect(segments[0].style.backgroundColor).toContain('rgb(255, 0, 0)');
    expect(segments[1].style.backgroundColor).toContain('rgb(0, 255, 0)');
  });
});
